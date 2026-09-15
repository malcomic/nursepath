import { z } from 'zod';
import { contentDocumentService } from '@/lib/services/contentDocumentService';
import type { ContentType } from '@/lib/types';

const createFileUrlSchema = (prefix: string, errorMessage: string) =>
  z.string().refine((value) => {
    if (value.startsWith(prefix)) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, errorMessage);

const fileUrlSchema = createFileUrlSchema('/api/content-documents/pdf/', 'Invalid file URL');
const previewPdfUrlSchema = createFileUrlSchema(
  '/api/content-documents/preview/',
  'Invalid preview PDF URL'
);
const thumbnailUrlSchema = createFileUrlSchema(
  '/api/content-documents/thumbnail/',
  'Invalid thumbnail URL'
);

const optionalSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .optional()
  .or(z.literal('').transform(() => undefined));

const contentTypeSchema = z.enum(['STUDY_DOC', 'QA_DOC']);

const createSchema = z.object({
  type: contentTypeSchema,
  title: z.string().min(1).max(255),
  slug: optionalSlugSchema,
  description: z.string().optional(),
  categoryId: z.string().min(1),
  fileUrl: fileUrlSchema,
  previewPdfUrl: previewPdfUrlSchema.nullable().optional(),
  thumbnailUrl: thumbnailUrlSchema.optional(),
});

const updateSchema = createSchema.partial();

/** Public payload without the full file URL. */
export function toPublicContentDocument<T extends { fileUrl: string }>(
  doc: T
): Omit<T, 'fileUrl'> {
  const { fileUrl: _fileUrl, ...rest } = doc;
  return rest;
}

export async function getAllContentDocuments(filters?: {
  type?: ContentType;
  categoryId?: string;
}) {
  const data = await contentDocumentService.getAll(filters);
  return { success: true as const, data };
}

export async function getAllContentDocumentsPublic(filters?: {
  type?: ContentType;
  categoryId?: string;
}) {
  const data = await contentDocumentService.getAll(filters);
  return { success: true as const, data: data.map(toPublicContentDocument) };
}

export async function getContentDocumentById(id: string) {
  const data = await contentDocumentService.getById(id);
  return { success: true as const, data };
}

export async function getContentDocumentByIdPublic(id: string) {
  const data = await contentDocumentService.getById(id);
  return { success: true as const, data: toPublicContentDocument(data) };
}

export async function createContentDocument(body: unknown) {
  const data = createSchema.parse(body);
  const doc = await contentDocumentService.create(data);
  return { success: true as const, data: doc };
}

export async function updateContentDocument(id: string, body: unknown) {
  const data = updateSchema.parse(body);
  const doc = await contentDocumentService.update(id, data);
  return { success: true as const, data: doc };
}

export async function deleteContentDocument(id: string) {
  await contentDocumentService.delete(id);
  return { success: true as const, message: 'Content document deleted' };
}

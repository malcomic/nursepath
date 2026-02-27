import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { guideController } from '../controllers/guideController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const thumbnailsDir = path.resolve(process.cwd(), 'uploads', 'thumbnails');
const pdfsDir = path.resolve(process.cwd(), 'uploads', 'pdfs');

const createStorage = (destinationDir: string, fallbackExt: string, fallbackName: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(destinationDir, { recursive: true });
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || fallbackExt;
    const safeBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || fallbackName;

    cb(null, `${Date.now()}-${safeBaseName}${ext}`);
  },
});

const uploadImage = multer({
  storage: createStorage(thumbnailsDir, '.jpg', 'thumbnail'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

const uploadPdf = multer({
  storage: createStorage(pdfsDir, '.pdf', 'guide'),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const hasPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

    if (!isPdfMime && !hasPdfExt) {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Public routes
router.get('/', guideController.getAll);
router.get('/search', guideController.search);
router.get('/category/:categoryId', guideController.getByCategory);
router.get('/:id', guideController.getById);

// Admin routes
router.post('/upload-thumbnail', authMiddleware, uploadImage.single('thumbnail'), guideController.uploadThumbnail);
router.post('/upload-pdf', authMiddleware, uploadPdf.single('pdf'), guideController.uploadPdf);
router.post('/', authMiddleware, guideController.create);
router.put('/:id', authMiddleware, guideController.update);
router.delete('/:id', authMiddleware, guideController.delete);

export default router;

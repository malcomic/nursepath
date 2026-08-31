export interface CategorySeo {
  title: string;
  description: string;
}

export const categorySeo: Record<string, CategorySeo> = {
  'nclex-rn': {
    title: 'NCLEX-RN Practice Questions & Study Guides',
    description:
      'Master NCLEX-RN practice questions with comprehensive study guides designed for nursing students preparing for licensure.',
  },
  pharmacology: {
    title: 'Pharmacology Nursing Exam Prep',
    description:
      'Pharmacology nursing exam prep resources covering drug classifications, dosage calculations, and safe medication administration.',
  },
  teas: {
    title: 'TEAS Exam Study Guides for Nursing Students',
    description:
      'Nursing school study guides and TEAS exam prep materials to help you succeed on your admission assessment.',
  },
  'hesi-a2': {
    title: 'HESI A2 Study Guides for Nursing School',
    description:
      'Nursing school study guide resources for the HESI A2 admission assessment with practice questions and review materials.',
  },
  'medical-surgical': {
    title: 'Medical-Surgical Nursing Study Guides',
    description:
      'Nursing school study guides for medical-surgical nursing covering essential concepts, practice questions, and exam prep.',
  },
  pediatrics: {
    title: 'Pediatric Nursing Study Guides',
    description:
      'Nursing school study guides for pediatric nursing with focused review materials and practice questions for students.',
  },
};

export const categorySlugs = Object.keys(categorySeo);

export function getCategorySeo(slug: string): CategorySeo {
  return (
    categorySeo[slug] ?? {
      title: 'Nursing Study Guides',
      description: 'Browse nursing study guides and exam prep resources from NursePath.',
    }
  );
}


export interface Category {
	id: string;
	name: string;
	description?: string | null;
	icon?: string | null;
}

export interface StudyGuide {
	id: string;
	title: string;
	description?: string | null;
	price: number;
	categoryId: string;
	pdfUrl?: string | null;
	thumbnailUrl?: string | null;
	// optional metadata used by the frontend; backend may omit these
	totalPages?: number;
	rating?: number;
	salesCount?: number;
	reviewCount?: number;
}

export type { StudyGuide as Guide };

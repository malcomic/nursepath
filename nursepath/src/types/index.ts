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
	createdAt?: string;
	updatedAt?: string;
	// optional metadata used by the frontend; backend may omit these
	totalPages?: number;
	rating?: number;
	salesCount?: number;
	reviewCount?: number;
	category?: {
		id: string;
		name: string;
		description?: string | null;
		icon?: string | null;
	};
}

export type { StudyGuide as Guide };

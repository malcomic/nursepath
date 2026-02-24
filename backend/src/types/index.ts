export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guide {
  id: string;
  title: string;
  description: string | null;
  price: number;
  categoryId: string;
  pdfUrl: string;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  guideId: string;
  buyerName: string;
  buyerEmail: string;
  purchasedAt: Date;
}

export interface AdminPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

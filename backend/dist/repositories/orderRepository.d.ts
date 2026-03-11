import { prisma } from '../lib/prisma';
import { PaymentStatus } from '../generated/prisma/enums';
export interface OrderFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: PaymentStatus;
    dateFrom?: Date;
    dateTo?: Date;
    sort?: 'newest' | 'oldest' | 'highest_price' | 'lowest_price';
}
export declare class OrderRepository {
    findById(id: string): Promise<({
        guide: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            stripePriceId: string | null;
            categoryId: string;
            pdfUrl: string;
            thumbnailUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        guideId: string;
        maxDownloads: number;
        paymentProvider: string | null;
        downloadToken: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        paymentStatus: PaymentStatus;
        downloadExpiresAt: Date;
        downloadCount: number;
        paymentReference: string | null;
        ipAddress: string | null;
    }) | null>;
    findManyWithFilters(filters: OrderFilters): Promise<{
        items: ({
            guide: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                stripePriceId: string | null;
                categoryId: string;
                pdfUrl: string;
                thumbnailUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: import("@prisma/client-runtime-utils").Decimal;
            guideId: string;
            maxDownloads: number;
            paymentProvider: string | null;
            downloadToken: string;
            customerName: string;
            customerEmail: string;
            customerPhone: string | null;
            paymentStatus: PaymentStatus;
            downloadExpiresAt: Date;
            downloadCount: number;
            paymentReference: string | null;
            ipAddress: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: Parameters<typeof prisma.order.create>[0]['data']): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        guideId: string;
        maxDownloads: number;
        paymentProvider: string | null;
        downloadToken: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        paymentStatus: PaymentStatus;
        downloadExpiresAt: Date;
        downloadCount: number;
        paymentReference: string | null;
        ipAddress: string | null;
    }>;
    update(id: string, data: Parameters<typeof prisma.order.update>[0]['data']): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        guideId: string;
        maxDownloads: number;
        paymentProvider: string | null;
        downloadToken: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        paymentStatus: PaymentStatus;
        downloadExpiresAt: Date;
        downloadCount: number;
        paymentReference: string | null;
        ipAddress: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: import("@prisma/client-runtime-utils").Decimal;
        guideId: string;
        maxDownloads: number;
        paymentProvider: string | null;
        downloadToken: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        paymentStatus: PaymentStatus;
        downloadExpiresAt: Date;
        downloadCount: number;
        paymentReference: string | null;
        ipAddress: string | null;
    }>;
}
export declare const orderRepository: OrderRepository;
//# sourceMappingURL=orderRepository.d.ts.map
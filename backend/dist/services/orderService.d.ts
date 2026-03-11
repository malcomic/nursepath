import { PaymentStatus } from '../generated/prisma/enums';
export declare class OrderService {
    listOrders(query: {
        page?: number;
        search?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        sort?: string;
    }): Promise<{
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
    getOrderById(id: string): Promise<{
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
    }>;
    createOrderFromPurchase(payload: {
        guideId: string;
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        price: number;
        paymentStatus: PaymentStatus;
        paymentReference?: string;
        paymentProvider?: string;
        ipAddress?: string;
        downloadToken: string;
        downloadExpiresAt: Date;
        maxDownloads: number;
    }): Promise<{
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
    getDownloadStatus(order: {
        downloadExpiresAt: Date;
        downloadCount: number;
        maxDownloads: number;
    }): "EXPIRED" | "NOT_DOWNLOADED" | "DOWNLOADED";
    canDownload(order: {
        paymentStatus: PaymentStatus;
        downloadExpiresAt: Date;
        downloadCount: number;
        maxDownloads: number;
    }): boolean;
    markAsRefunded(id: string): Promise<{
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
    deleteOrder(id: string): Promise<void>;
    resendDownloadLink(id: string, baseUrl: string): Promise<{
        downloadUrl: string;
    }>;
    regenerateDownloadLink(id: string, baseUrl: string, options?: {
        maxDownloads?: number;
        expiryHours?: number;
    }): Promise<{
        order: {
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
        };
        downloadUrl: string;
    }>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=orderService.d.ts.map
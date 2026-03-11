export declare const PaymentStatus: {
    readonly PAID: "PAID";
    readonly PENDING: "PENDING";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const ReviewStatus: {
    readonly pending: "pending";
    readonly approved: "approved";
    readonly rejected: "rejected";
};
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];
//# sourceMappingURL=enums.d.ts.map
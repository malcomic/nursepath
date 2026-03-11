import { Request, Response } from 'express';
export declare class StripeController {
    createCheckoutSession: (req: Request, res: Response, next: import("express").NextFunction) => void;
    webhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const stripeController: StripeController;
//# sourceMappingURL=stripeController.d.ts.map
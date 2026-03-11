import { Response } from 'express';
export declare class OrderController {
    getAll: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    refund: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    resendLink: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    regenerateLink: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const orderController: OrderController;
//# sourceMappingURL=orderController.d.ts.map
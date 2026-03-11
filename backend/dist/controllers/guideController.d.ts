import { Response } from 'express';
export declare class GuideController {
    getAll: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getByCategory: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    search: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    uploadThumbnail: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    uploadPdf: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const guideController: GuideController;
//# sourceMappingURL=guideController.d.ts.map
import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    admin?: {
        id: string;
        email: string;
    };
}
export declare class ApiError extends Error {
    statusCode: number;
    errors?: unknown | undefined;
    constructor(statusCode: number, message: string, errors?: unknown | undefined);
}
export declare const errorHandler: (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map
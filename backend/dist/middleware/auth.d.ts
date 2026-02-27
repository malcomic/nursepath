import { Response, NextFunction } from 'express';
import { AuthRequest } from './errorHandler';
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map
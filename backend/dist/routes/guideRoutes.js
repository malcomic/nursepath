"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const guideController_1 = require("../controllers/guideController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const thumbnailsDir = path_1.default.resolve(process.cwd(), 'uploads', 'thumbnails');
const pdfsDir = path_1.default.resolve(process.cwd(), 'uploads', 'pdfs');
const createStorage = (destinationDir, fallbackExt, fallbackName) => multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        fs_1.default.mkdirSync(destinationDir, { recursive: true });
        cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname) || fallbackExt;
        const safeBaseName = path_1.default
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 50) || fallbackName;
        cb(null, `${Date.now()}-${safeBaseName}${ext}`);
    },
});
const uploadImage = (0, multer_1.default)({
    storage: createStorage(thumbnailsDir, '.jpg', 'thumbnail'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed'));
            return;
        }
        cb(null, true);
    },
});
const uploadPdf = (0, multer_1.default)({
    storage: createStorage(pdfsDir, '.pdf', 'guide'),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const isPdfMime = file.mimetype === 'application/pdf';
        const hasPdfExt = path_1.default.extname(file.originalname).toLowerCase() === '.pdf';
        if (!isPdfMime && !hasPdfExt) {
            cb(new Error('Only PDF files are allowed'));
            return;
        }
        cb(null, true);
    },
});
// Public routes
router.get('/', guideController_1.guideController.getAll);
router.get('/search', guideController_1.guideController.search);
router.get('/category/:categoryId', guideController_1.guideController.getByCategory);
router.get('/:id', guideController_1.guideController.getById);
// Admin routes
router.post('/upload-thumbnail', auth_1.authMiddleware, uploadImage.single('thumbnail'), guideController_1.guideController.uploadThumbnail);
router.post('/upload-pdf', auth_1.authMiddleware, uploadPdf.single('pdf'), guideController_1.guideController.uploadPdf);
router.post('/', auth_1.authMiddleware, guideController_1.guideController.create);
router.put('/:id', auth_1.authMiddleware, guideController_1.guideController.update);
router.delete('/:id', auth_1.authMiddleware, guideController_1.guideController.delete);
exports.default = router;
//# sourceMappingURL=guideRoutes.js.map
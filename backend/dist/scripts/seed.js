"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const seed = async () => {
    try {
        const ADMIN_EMAIL = 'admin@scholarswriters.com';
        const ADMIN_PASSWORD = 'SecurePassword123!';
        // Check if admin already exists
        const existing = await prisma_1.prisma.admin.findUnique({
            where: { email: ADMIN_EMAIL },
        });
        if (!existing) {
            // Hash password
            const passwordHash = await bcrypt_1.default.hash(ADMIN_PASSWORD, 10);
            // Create admin
            await prisma_1.prisma.admin.create({
                data: {
                    email: ADMIN_EMAIL,
                    passwordHash,
                },
            });
            console.log('✅ Admin created successfully');
            console.log(`Email: ${ADMIN_EMAIL}`);
            console.log(`Password: ${ADMIN_PASSWORD}`);
            console.log('⚠️  Please change the password after first login!');
        }
        else {
            console.log('ℹ️  Admin already exists');
        }
        // Seed categories
        const categories = [
            { name: 'NCLEX-RN', description: 'National Council Licensure Examination for Registered Nurses', icon: '📋' },
            { name: 'TEAS', description: 'Test of Essential Academic Skills', icon: '🧪' },
            { name: 'HESI A2', description: 'Health Education Systems, Inc. Admission Assessment', icon: '⚕️' },
            { name: 'Pharmacology', description: 'Nursing Pharmacology and Drug Administration', icon: '💊' },
            { name: 'Medical-Surgical', description: 'Medical-Surgical Nursing', icon: '🏥' },
            { name: 'Pediatrics', description: 'Pediatric Nursing', icon: '👶' },
        ];
        for (const cat of categories) {
            const existing = await prisma_1.prisma.category.findUnique({
                where: { name: cat.name },
            });
            if (!existing) {
                await prisma_1.prisma.category.create({
                    data: cat,
                });
                console.log(`✅ Category created: ${cat.name}`);
            }
        }
        // Seed guides
        const categoryData = await prisma_1.prisma.category.findMany();
        const guides = [
            {
                title: 'NCLEX-RN Comprehensive Review',
                description: 'Complete study guide covering all major NCLEX-RN topics with practice questions.',
                price: 29.99,
                categoryId: categoryData.find(c => c.name === 'NCLEX-RN')?.id || '',
                pdfUrl: 'https://example.com/nclex-rn.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=NCLEX-RN',
            },
            {
                title: 'TEAS Exam Mastery',
                description: 'Complete TEAS exam preparation guide with 500+ practice questions.',
                price: 24.99,
                categoryId: categoryData.find(c => c.name === 'TEAS')?.id || '',
                pdfUrl: 'https://example.com/teas.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=TEAS',
            },
            {
                title: 'HESI A2 Study Guide',
                description: 'In-depth HESI A2 exam preparation with practice exams.',
                price: 27.99,
                categoryId: categoryData.find(c => c.name === 'HESI A2')?.id || '',
                pdfUrl: 'https://example.com/hesi-a2.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=HESI+A2',
            },
            {
                title: 'Pharmacology Essentials',
                description: 'Essential drugs, mechanisms, and nursing implications for nursing exams.',
                price: 22.99,
                categoryId: categoryData.find(c => c.name === 'Pharmacology')?.id || '',
                pdfUrl: 'https://example.com/pharmacology.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=Pharmacology',
            },
            {
                title: 'Med-Surg Nursing Fundamentals',
                description: 'Complete medical-surgical nursing guide with clinical scenarios.',
                price: 31.99,
                categoryId: categoryData.find(c => c.name === 'Medical-Surgical')?.id || '',
                pdfUrl: 'https://example.com/med-surg.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=Med-Surg',
            },
            {
                title: 'Pediatric Nursing Care',
                description: 'Essential pediatric nursing concepts and care guidelines.',
                price: 25.99,
                categoryId: categoryData.find(c => c.name === 'Pediatrics')?.id || '',
                pdfUrl: 'https://example.com/pediatrics.pdf',
                thumbnailUrl: 'https://via.placeholder.com/300x400?text=Pediatrics',
            },
        ];
        for (const guide of guides) {
            if (guide.categoryId) {
                const existing = await prisma_1.prisma.guide.findFirst({
                    where: { title: guide.title },
                });
                if (!existing) {
                    await prisma_1.prisma.guide.create({
                        data: guide,
                    });
                    console.log(`✅ Guide created: ${guide.title}`);
                }
            }
        }
        // Seed global settings
        const existingSettings = await prisma_1.prisma.settings.findUnique({
            where: { id: 'global' },
        });
        if (!existingSettings) {
            await prisma_1.prisma.settings.create({
                data: {
                    // Defaults are also enforced by Prisma schema, but we set them explicitly here
                    downloadExpiryHours: 48,
                    maxDownloads: 3,
                    supportEmail: 'support@scholarwriters.com',
                    currency: 'USD',
                },
            });
            console.log('✅ Global settings created');
        }
        else {
            console.log('ℹ️  Global settings already exist');
        }
        console.log('\n✅ Database seeding completed!');
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
};
seed();
//# sourceMappingURL=seed.js.map
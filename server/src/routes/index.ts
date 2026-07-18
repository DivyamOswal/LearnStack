import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes'
import adminRoutes from '../modules/admin/admin.routes'
import blogRoutes from '../modules/blog/blog.routes'
import courseRoutes from '../modules/courses/courses.routes'
import lessonRoutes from '../modules/lessons/lessons.routes'
import chapterRoutes from '../modules/chapters/chapters.routes'
import certificateRoutes from '../modules/certifications/certifications.routes'
const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy.' });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

// Modules not built yet — mount these as you build them:
router.use('/courses', courseRoutes);
router.use('/chapters', chapterRoutes);
router.use('/lessons', lessonRoutes);
// router.use('/quizzes', quizRoutes);
router.use('/certificates', certificateRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/comments', commentRoutes);
router.use('/blog', blogRoutes);

export default router;

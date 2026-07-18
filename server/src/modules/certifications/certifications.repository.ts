import prisma from '../../config/db';

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

// Total lesson count across every chapter in the course
export const countLessonsInCourse = async (courseId: string) => {
  return prisma.lesson.count({
    where: { chapter: { courseId } },
  });
};

// How many of those lessons this user has marked complete
export const countCompletedLessonsForUser = async (userId: string, courseId: string) => {
  return prisma.progress.count({
    where: {
      userId,
      courseId,
      completed: true,
    },
  });
};

export const findExistingCertificate = (userId: string, courseId: string) => {
  return prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
};

export const createCertificate = (data: {
  userId: string;
  courseId: string;
  certificateCode: string;
  qrCodeUrl: string;
  pdfUrl: string;
}) => {
  return prisma.certificate.create({ data });
};

export const findCertificatesForUser = (userId: string) => {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      course: { select: { id: true, title: true, thumbnailUrl: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });
};

export const findCertificateByCode = (certificateCode: string) => {
  return prisma.certificate.findUnique({
    where: { certificateCode },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });
};

export const findCertificateById = (id: string) => {
  return prisma.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
    },
  });
};

export const findAllCertificatesForAdmin = () => {
  return prisma.certificate.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });
};
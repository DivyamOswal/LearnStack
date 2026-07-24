export interface PurchasedCourseOrder {
  id: string;
  amount: string;
  course: { id: string; title: string; slug: string; thumbnailUrl: string | null };
}

export interface RecentLesson {
  lesson: { id: string; title: string };
  course: { id: string; title: string; slug: string };
  completed: boolean;
  updatedAt: string;
}

export interface RecentQuizResult {
  id: string;
  score: number;
  passed: boolean;
  quiz: { id: string; title: string };
  attemptedAt: string;
}

export interface DashboardSummary {
  purchasedCourses: PurchasedCourseOrder[];
  stats: {
    totalCoursesPurchased: number;
    totalCertificates: number;
    totalBookmarks: number;
  };
  recentLessons: RecentLesson[];
  recentQuizResults: RecentQuizResult[];
}

export interface BookmarkedCourse {
  id: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    price: string;
    discountPrice: string | null;
  };
}
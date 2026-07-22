export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  price: string;
  discountPrice: string | null;
  isPublished: boolean;
  createdAt: string;
  category: Category;
  _count: { reviews: number; orders: number };
}

export interface LessonSummary {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE' | 'MARKDOWN' | 'CODE_SNIPPET';
  order: number;
}

export interface ChapterSummary {
  id: string;
  title: string;
  order: number;
  lessons: LessonSummary[];
}

export interface QuizSummary {
  id: string;
  title: string;
}

export interface CourseDetail extends Course {
  createdBy: { id: string; name: string; avatarUrl: string | null };
  chapters: ChapterSummary[];
  quizzes: QuizSummary[];
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export interface CourseListResult {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
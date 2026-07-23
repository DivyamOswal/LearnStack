export interface AdminCourseListItem {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  price: string;
  isPublished: boolean;
  category: { id: string; name: string };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  isPublished?: boolean;
}

export interface AdminChapter {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; title: string; type: string; order: number }[];
}

export interface AdminCourseDetail {
  id: string;
  title: string;
  description: string;
  price: string;
  discountPrice: string | null;
  categoryId: string;
  isPublished: boolean;
  thumbnailUrl: string | null;
}

export type LessonType = 'VIDEO' | 'ARTICLE' | 'MARKDOWN' | 'CODE_SNIPPET';

export interface CreateLessonInput {
  title: string;
  type: LessonType;
  order: number;
  chapterId: string;
  content?: string;
}

export interface AdminLesson {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  videoUrl: string | null;
  pdfUrl: string | null;
  content: string | null;
}
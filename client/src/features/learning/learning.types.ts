export type LessonType = 'VIDEO' | 'ARTICLE' | 'MARKDOWN' | 'CODE_SNIPPET';

export interface Topic {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  type: LessonType;
  order: number;
  videoUrl: string | null;
  pdfUrl: string | null;
  content: string | null;
  topics: Topic[];
  chapter: { id: string; title: string; courseId: string };
}

export interface SidebarLesson {
  id: string;
  title: string;
  type: LessonType;
  order: number;
}

export interface SidebarChapter {
  id: string;
  title: string;
  order: number;
  lessons: SidebarLesson[];
}

export interface ProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  isComplete: boolean;
}
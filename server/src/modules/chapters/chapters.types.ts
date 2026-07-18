export interface CreateChapterInput {
  title: string;
  order: number;
  courseId: string;
}

export interface UpdateChapterInput {
  title?: string;
  order?: number;
}

export interface ReorderChaptersInput {
  chapterId: string;
  order: number;
}
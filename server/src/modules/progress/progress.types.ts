export interface MarkLessonCompleteInput {
  lessonId: string;
}

export interface CourseProgressSummary {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentComplete: number;
  isComplete: boolean;
}
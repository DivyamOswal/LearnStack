export interface CreateTopicInput {
  title: string;
  content: string;
  order: number;
  lessonId: string;
}

export interface UpdateTopicInput {
  title?: string;
  content?: string;
  order?: number;
}
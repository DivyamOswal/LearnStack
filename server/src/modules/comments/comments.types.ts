export interface CreateCommentInput {
  content: string;
  lessonId: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  content: string;
}
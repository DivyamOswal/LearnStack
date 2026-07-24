export interface ReportedComment {
  id: string;
  content: string;
  likes: number;
  isReported: boolean;
  createdAt: string;
  user: { id: string; name: string; email: string };
  lesson: { id: string; title: string };
}
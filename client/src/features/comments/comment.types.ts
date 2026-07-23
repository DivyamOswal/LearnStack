export interface CommentUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface CommentReply {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: CommentUser;
}

export interface CommentThread {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: CommentUser;
  replies: CommentReply[];
}
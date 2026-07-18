export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
}

export interface BroadcastNotificationInput {
  title: string;
  message: string;
  targetRole?: 'STUDENT' | 'ADMIN' | 'ALL';
}
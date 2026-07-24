export type BroadcastTarget = 'STUDENT' | 'ADMIN' | 'ALL';

export interface BroadcastNotificationInput {
  title: string;
  message: string;
  targetRole: BroadcastTarget;
}

export interface BroadcastResult {
  notifiedCount: number;
}
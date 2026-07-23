export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  _count: { courses: number };
}
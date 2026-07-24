export interface SearchCourseResult {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
}

export interface SearchLessonResult {
  id: string;
  title: string;
  chapter: { course: { slug: string; title: string } };
}

export interface SearchInstructorResult {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface SearchResults {
  courses: SearchCourseResult[];
  lessons: SearchLessonResult[];
  instructors: SearchInstructorResult[];
}
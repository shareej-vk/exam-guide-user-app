import { browser } from '$app/environment';

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  order?: number;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseData {
  subject: {
    id: string;
    name: string;
  };
  units: Unit[];
  totalLessons: number;
  about?: string;
}

class CourseDataState {
  courseData: CourseData | null = $state(null);
  isLoading = $state(false);
  async setCourseData(courseData: CourseData) {
    this.courseData = courseData;
}	
}

// Export a singleton instance
export const courseDataStore = new CourseDataState();


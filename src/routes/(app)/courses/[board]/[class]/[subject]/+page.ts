import type { PageLoad } from './$types';
import init, { decrypt_json } from "$lib/pkg/wasm_encryptor.js";
import { courseDataStore } from "$lib/stores/courseStore.svelte";
export const ssr = false;
export const csr = true;

interface Lesson {
  id: string;
  title: string;
  duration?: string;
  order?: number;
  description?: string;
}

interface Unit {
  id: string;
  name: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  subject: {
    id: string;
    name: string;
  };
  units: Unit[];
  totalLessons: number;
  about?: string;
}

export const load: PageLoad = async ({ params, fetch }): Promise<{
  board: string;
  class: string;
  subject: string;
  courseData: CourseData | null;
  error: string | null;
}> => {
 // console.log('Route parameters:', params);
  await init();
  
  try {
    // Construct the path to the JSON file based on the route parameters
    const jsonFilePath = `/data/${params.board}-${params.class}-${params.subject}.json`;
   // console.log('Loading data from:', jsonFilePath);
    
    // Fetch the JSON file
    const response = await fetch(jsonFilePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON data
    const courseDataRaw: any = await response.text()
    const courseData: CourseData = JSON.parse(decrypt_json(courseDataRaw));
    courseDataStore.setCourseData(courseData);
   
    
    // Validate the course data structure
    if (!courseData || !Array.isArray(courseData.units)) {
      throw new Error('Invalid course data format: missing units array');
    }
    
    // Calculate total lessons across all units
    const totalLessons = courseData.units.reduce((sum: number, unit: Unit) => 
      sum + (unit.lessons?.length || 0), 0);
    
    // Return the data to be used in the Svelte component
    return {
      board: params.board,
      class: params.class,
      subject: params.subject,
      courseData: {
        ...courseData,
        totalLessons
      },
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load course data';
    console.error('Error loading course data:', errorMessage);
    
    return {
      board: params.board as string,
      class: params.class as string,
      subject: params.subject as string,
      courseData: null,
      error: errorMessage
    };
  }
}
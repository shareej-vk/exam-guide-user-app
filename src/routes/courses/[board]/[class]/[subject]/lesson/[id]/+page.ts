import type { PageLoad } from './$types';

interface ParsedContent {
  type: string;
  content: string;
  children?: ParsedContent[];
  attributes?: Record<string, string>;
}

interface LessonContent {
  id: string;
  title: string;
  content: string;
  duration?: string;
  order?: number;
  description?: string;
  intros?: string;
  slides?: ParsedContent[];
  introset1?: any;
  introset2?: any;
  questions?: string[];
  exercises?: string[];
  // Add other lesson properties as needed
}

function parseHtmlContent(html: string): any {
let slides:any = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild as HTMLElement;
  
  
  doc.querySelectorAll('.tab-content').forEach((slide:any) => {
    console.log(slide)
    let slideObj:any = {
        
    };
    slideObj.introTitle = slide.querySelector('.intro-title').textContent;
    slideObj.introQuestion = slide.querySelector('.intro-question').textContent;
    slideObj.svg = slide.querySelector('svg').outerHTML;
    slideObj.introExplanation = slide.querySelectorAll('.intro-explanation')[0].textContent;
    slideObj.introExplanation2 = slide.querySelectorAll('.intro-explanation')[1]?.textContent;
    slideObj.introTagline = slide.querySelector('.intro-tagline').textContent;
    slides.push(slideObj);
  
  }); 
  
  console.log(slides)
  return slides;
}

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    // Construct the path to the lesson JSON file
    const lessonPath = `/data/lessons/${params.id}.json`;
    console.log('Loading lesson from:', lessonPath);    
    // Fetch the lesson data
    const response = await fetch(lessonPath);    
    if (!response.ok) {
      throw new Error(`Failed to load lesson: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON data
    const lessonData: LessonContent = await response.json();
    
    // Parse HTML content if intros exist
    if (lessonData.intros) {
      const parsedIntros = parseHtmlContent(lessonData.intros);
      lessonData.slides = parsedIntros;
    }
    //let introset1Response = await fetch(`/data/intros/lesson-${params.id}-intros-intros-set1.json`);
    //let introset2Response = await fetch(`/data/intros/lesson-${params.id}-intros-intros-set2.json`);

    //let introset1Data = await introset1Response.json();
    //let introset2Data = await introset2Response.json();
   // lessonData.introset1 = JSON.parse(introset1Data.intros);
    //console.log("Intro Set 1",lessonData.introset1)
  //  lessonData.introset2 = introset2Data;
    
    // Return the data to be used in the Svelte component
    return {
      board: params.board,
      class: params.class,
      subject: params.subject,
      lessonId: params.id,
      lesson: lessonData,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load lesson data';
    console.error('Error loading lesson:', errorMessage);
    
    return {
      board: params.board,
      class: params.class,
      subject: params.subject,
      lessonId: params.id,
      lesson: null,
      error: errorMessage
    };
  }
};

// This tells SvelteKit that this is a client-side only component
export const ssr = false;
export const csr = true;
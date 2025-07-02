<script lang="ts">
  import { page } from '$app/state';
  import { onMount, onDestroy, tick } from 'svelte';
  import IntroSlides from '$lib/components/IntroSlides.svelte';
  interface LessonContent {
    id: string;
    title: string;
    content: string;
    duration?: string;
    order?: number;
    description?: string;
    intros?: string;
    questions?: string[];
    exercises?: string[];
  }
  
  interface PageData {
    board: string;
    class: string;
    subject: string;
    lessonId: string;
    lesson: LessonContent | null;
    error: string | null;
  }
  
  // Use $props() to get the data from the parent component
  let { data } = $props<{ data: PageData }>();
  console.log(data.lesson);
  sessionStorage.setItem('selectedLessonId', page.params.id);
 
  
  let activeTab = $state('introduction');
  let isModalOpen = $state(true);
  console.log("LESSSON", page)
  // Hide body overflow when modal is open
  $effect(() => {
    if(page.params.id){
      sessionStorage.setItem('selectedLessonId', page.params.id);
    }
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('modal-open');
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('modal-open');
    };
  });
  
  // Set the active tab to 'notes' if there's no introduction content
  $effect(() => {
    if (data.lesson && !data.lesson.intros) {
      activeTab = 'notes';
      isModalOpen = false;    
    }
  });
  
  function closeModal() {
    isModalOpen = false;
    activeTab = 'notes';
  }
  
  // Cleanup on component destroy
  onDestroy(() => {
    document.body.style.overflow = '';
    document.documentElement.classList.remove('modal-open');
  });

  // Handle button click effect
  function createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'scale(0)';
    circle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    circle.style.background = 'rgba(0, 0, 0, 0.1)';
    circle.style.pointerEvents = 'none';
    
    button.appendChild(circle);
    
    // Trigger the animation
    setTimeout(() => {
      circle.style.transform = 'scale(4)';
      circle.style.opacity = '0';
    }, 10);
    
    // Clean up
    setTimeout(() => {
      circle.remove();
    }, 600);
  }

  function handleQuestionsShowHide(){
    document.querySelectorAll('.question-answer-container').forEach(container => {
  const button = container.querySelector('.show-answer-button');
  const answer = container.querySelector('.answer-container');

  button.addEventListener('click', () => {
    const isVisible = answer.style.display === 'block';
    answer.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
  });
});
  }


 function handleExercisesShowHide(){
    document.querySelectorAll('.exercise-container').forEach(container => {
  const button = container.querySelector('.show-answer-button');
  const answer = container.querySelector('.answer-container');

  button.addEventListener('click', () => {
    const isVisible = answer.style.display === 'block';
    answer.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
  });
});
  }



  async function selectTab(tab: string) {
    activeTab = tab;
    isModalOpen = false;
    await tick();
    if(tab === 'questions') {
      handleQuestionsShowHide();
    }
    if(tab === 'exercises') {
      handleExercisesShowHide();
    }
    
    
    
    
    // Ensure DOM updates before proceeding
     // Close modal when switching tabs
    
  }
  
  // Format text by replacing underscores with spaces and capitalizing words
  function formatText(text: string): string {
    if (!text) return '';
    return text
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  // Format the board, class, and subject for display
  const displayBoard = $derived(formatText(data.board));
  const displayClass = $derived(`Class ${data.class}`);
  const displaySubject = $derived(formatText(data.subject));
  
  // Generate the back URL to the subject page
  const backToChaptersUrl = $derived(`/courses/${data.board}/${data.class}/${data.subject}`);
</script>

<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 max-w-6xl py-6">
    <!-- Removed standalone back button as it's now in the tabs -->

    {#if data.error}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {data.error}
            </p>
          </div>
        </div>
      </div>
    {:else if data.lesson}
      <!-- Lesson Header -->
      <header class="mb-8">
      
        <div class="flex items-center text-sm text-gray-500 space-x-4">
          {#if data.lesson.duration}
            <span class="flex items-center">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.lesson.duration}
            </span>
          {/if}
        </div>
      </header>

      <!-- Tabs - Fixed at the top -->
      <div class="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div class="container mx-auto px-4 max-w-6xl">
          <nav class="flex -mb-px" aria-label="Tabs">
            <a
              href={backToChaptersUrl}
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center"
              title="Go to Chapters"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Chapters
            </a>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'introduction' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={() => (activeTab = 'introduction')}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thoughts
              </span>
            </button>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={() => (activeTab = 'notes')}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
              </span>
            </button>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'questions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{selectTab('questions')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions
              </span>
            </button>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'exercises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{selectTab('exercises')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Exercises
              </span>
            </button>

            <button
            class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'summary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            onclick={() => (activeTab = 'summary')}
          >
            <span class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Summary
            </span>
          </button>
          </nav>
        </div>
      </div>
      
      <!-- Spacer to push content below fixed tabs -->
       
      <!-- Tab Content -->
        <div class="p-6 bg-white overflow-y-auto" style="margin-top: -34px; max-height: calc(100vh - 60px);">
          {#if activeTab === 'introduction'}
            <div class="prose max-w-none">
              <IntroSlides slides={data.lesson.slides} />
            </div>
          
          {:else if activeTab === 'notes'}
          <div class="prose max-w-none">
            {@html data.lesson.content}
          </div>
          
          {:else if activeTab === 'questions'}
          <div class="prose max-w-none">
            {@html data.lesson.questions}
          </div>
          
          {:else if activeTab === 'exercises'}
          <div class="prose max-w-none">
            {@html data.lesson.exercises}
          </div>
       

          {:else if activeTab === 'summary'}
          <div class="prose max-w-none">
            {@html data.lesson.summary}
          </div>
          {/if}
        </div>
      
    {/if}
  </div>
</div>

<style>
  /* Hide main header when modal is open */
  :global(html.modal-open) header {
    display: none !important;
  }
  
  /* Scoped styles for the tab content */
  :global(.prose) {
    line-height: 1.75;
  }
  
  /* Larger typography for the modal content */
  :global(.prose-lg) {
    font-size: 1.125rem;
    line-height: 1.7777778;
  }
  
  :global(.prose-lg h1) {
    font-size: 2.25rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    line-height: 1.1111111;
    font-weight: 700;
  }
  
  :global(.prose-lg h2) {
    font-size: 1.875rem;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.3333333;
    font-weight: 600;
  }
  
  :global(.prose-lg p) {
    margin-top: 1.3333333em;
    margin-bottom: 1.3333333em;
  }
  :global(.prose h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  :global(.prose h3) {
    font-size: 1.25rem;
    font-weight: 500;
    color: #111827;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }
  :global(.prose p) {
    color: #374151;
    margin-bottom: 1rem;
  }
  :global(.prose ul),
  :global(.prose ol) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-bottom: 1rem;
  }
  :global(.prose li) {
    margin-bottom: 0.5rem;
  }
  :global(.prose a) {
    color: #2563eb;
    text-decoration: none;
  }
  :global(.prose a:hover) {
    text-decoration: underline;
  }
  :global(header) {
    display: none !important;
  }
  
  /* Ensure content doesn't get hidden behind fixed tabs */
  .pt-16 {
    padding-top: 4rem;
  }

</style>
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import {page} from '$app/state';
  
  let { slides } = $props<{ slides: any[] }>();
  let currentSlide = $state(0);
  let isTransitioning = $state(false);
  let direction = $state(1); // 1 for forward, -1 for backward

  function nextSlide() {
    if (currentSlide < slides.length - 1 && !isTransitioning) {
      isTransitioning = true;
      direction = 1;
      currentSlide++;
      setTimeout(() => isTransitioning = false, 500);
    }
  }

  function prevSlide() {
    if (currentSlide > 0 && !isTransitioning) {
      isTransitioning = true;
      direction = -1;
      currentSlide--;
      setTimeout(() => isTransitioning = false, 500);
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }
  }

  $effect(() => {
    if (page.params) {
      currentSlide = 0;
    }
  });

  // Animation parameters
  const fadeTransition = (node: Element, { delay = 0, duration = 300 }) => ({
    delay,
    duration,
    css: (t: number) => `
      opacity: ${t};
      transition: opacity ${duration}ms ease-in-out;
    `
  });

  const fadeIn = (node: Element, { delay = 0, duration = 300 }) => ({
    delay,
    duration,
    css: (t: number) => `
      opacity: ${t};
      transition: opacity ${duration}ms ease-in-out;
    `
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
    circle.style.background = 'rgba(255, 255, 255, 0.5)';
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
  
  // Add keyboard event listener when component mounts
  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>
 <!-- Left Navigation Arrow -->
<h3 class="lesson-title">{slides[0].lessonTitle}</h3>  

<div class="relative w-full h-full flex items-center justify-center">
 
  <div class="nav-arrow-container relative">
    <button
        onclick={(e) => {
          e.preventDefault();
          createRipple(e);
          prevSlide();
          window.scrollTo({ top: 0 });
        }}
        class="left-nav  overflow-hidden mr-4 p-4 rounded-full bg-white shadow-xl text-gray-700 hover:bg-gray-100 transition-all transform hover:scale-110 active:scale-95"
        aria-label="Previous slide"
        disabled={currentSlide === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    
        <!-- Right Navigation Arrow -->
        <button
        onclick={(e) => {
          e.preventDefault();
          createRipple(e);
          nextSlide();
          window.scrollTo({ top: 0 });
        }}
        class="right-nav  overflow-hidden ml-4 p-4 rounded-full bg-white shadow-xl text-gray-700 hover:bg-gray-100 transition-all transform hover:scale-110 active:scale-95"
        aria-label="Next slide"
        disabled={currentSlide === slides.length - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

  <!-- Slide Container -->
  <div class="flex-1 max-w-4xl">
    {#key currentSlide}
      <div class="w-full bg-white p-10 rounded-xl slide-box">
        <!-- Title -->
        <div>
          <h1 class="intro-question text-xl text-left italic font-bold mb-6 text-gray-800">
            {slides[currentSlide].introQuestion}
          </h1>
        </div>
        
        <div class="space-y-8">
          <!-- SVG and First Paragraph Side by Side -->
          <div class="flex flex-col  gap-8 items-center">
            <div class="svg-container">
              <div class="">
                {@html slides[currentSlide].svg}
              </div>
            </div>
            <div class="w-full">
              <h2 class="tag-line txt-italic">{slides[currentSlide].introTagline}</h2>
              <p class="first-para">
                {@html slides[currentSlide].introExplanation}
                {#if slides[currentSlide].introExplanation2}
                <br/> <br/>
                    {@html slides[currentSlide].introExplanation2}
                  
                {/if}
              </p>  
            </div>
          
          </div>
          
       
        </div>

        <!-- Slide Indicator -->
        <div class="flex justify-center mt-8 space-x-3">
          {#each slides as _, index}
            <button
              onclick={() => {
                if (index !== currentSlide && !isTransitioning) {
                  isTransitioning = true;
                  direction = index > currentSlide ? 1 : -1;
                  currentSlide = index;
                  setTimeout(() => isTransitioning = false, 500);
                }
              }}
              class="w-3 h-3 rounded-full transition-all duration-300 {index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'step' : false}
            ></button>
          {/each}
        </div>
      </div>
    {/key}
  </div>


</div>

<style>
  .lesson-title{
    position: fixed;
    top: 45px;
    font-size: 26px;
    background: #d583e3;
    width: 100%;
    left: 0;
    color: #ffffff;
    padding: 10px;
    z-index: 100;
    text-align: center;
    font-weight: bold;
  }
  .nav-arrow-container{
    position: fixed;
    z-index: 9999;
  }
 

  .left-nav{
    position: fixed;
    top: 200px;
    left: 50px;
  }
  .right-nav{
    position: fixed;
    top: 200px;
    right: 50px;
  }
  .svg-container {
    width: 70%;
  }
  .tag-line {
    font-style: italic;
    background: antiquewhite;
    padding: 14px;

  }
  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none !important;
  }
  
  button:not(:disabled) {
    cursor: pointer;
  }
  
  button:active:not(:disabled) {
    transform: scale(0.95) !important;
  }
  
  .slide-box {
  
    margin-top: 15px;
   
    overflow-y: auto;
    margin-top: -24px;
   
   
  }
  .intro-question {

    font-weight: bold;
    font-size: 28px;
    line-height: 2.9rem;
  }
  .first-para {
    background: #fafafa;
    padding: 12px;
    padding-left: 20px;
    padding-top: 14px;
    margin-top: 0;
    font-size: 18px;
    border: 2px dashed silver;
    border-radius: 12px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  .second-para {
    background: #f8f8f8;
    padding: 12px;
    padding-top: 14px;
    margin-top: 0;
    font-size: 16px;
    border: 2px dashed silver;
    border-radius: 12px;
  }
</style>
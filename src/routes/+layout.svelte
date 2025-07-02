<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	
	let isScrolled = $state(false);
	
	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
    <link rel="stylesheet" href="/css/tabs.css"> 
	<script src="/js/custom.js"></script>    
</svelte:head>

<header class:scrolled={isScrolled}>
	<nav>
		<div class="container">
			<div class="logo">
				<a href="/" class="brand">EduBuddy</a>
			</div>
			
			<div class="nav-links">
				<a href="#" class="nav-link">Courses</a>
				<a href="#" class="nav-link">Live Classes</a>
				<a href="#" class="nav-link">Study Materials</a>
				<a href="#" class="nav-link">About Us</a>
			</div>
			
			<div class="auth-buttons">
				<a href="/#" class="btn btn-outline">Login</a>
				<a href="/#" class="btn btn-primary">Sign Up</a>
			</div>
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<!-- <footer>
	<div class="container">
		<div class="footer-content">
			<div class="footer-section">
				<h3>EduBuddy</h3>
				<p>Personalized learning platform for students of all ages.</p>
			</div>
			
			<div class="footer-section">
				<h4>Quick Links</h4>
				<a href="#">About Us</a>
				<a href="#">Courses</a>
				<a href="#">Pricing</a>
				<a href="#">Contact</a>
			</div>
			
			<div class="footer-section">
				<h4>Follow Us</h4>
				<div class="social-links">
					<a href="#" aria-label="Facebook">FB</a>
					<a href="#" aria-label="Twitter">TW</a>
					<a href="#" aria-label="Instagram">IG</a>
					<a href="#" aria-label="YouTube">YT</a>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; {new Date().getFullYear()} EduBuddy. All rights reserved.</p>
		</div>
	</div>
</footer> -->

<style>
	:global(html, body) {
		background: #f9fafb;
		margin: 0;
		padding: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: all 0.3s ease;
		background: transparent;
	}

	header.scrolled {
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	nav {
		display: flex;
		align-items: center;
		height: 70px;
	}

	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo .brand {
		font-size: 1.5rem;
		font-weight: 700;
		color: #4f46e5;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		text-decoration: none;
		color: #1f2937;
		font-weight: 500;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: #4f46e5;
	}

	.auth-buttons {
		display: flex;
		gap: 1rem;
	}

	.btn {
		padding: 0.5rem 1.25rem;
		border-radius: 0.375rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-outline {
		border: 1px solid #4f46e5;
		color: #4f46e5;
	}

	.btn-outline:hover {
		background-color: #eef2ff;
	}

	.btn-primary {
		background-color: #4f46e5;
		color: white;
	}

	.btn-primary:hover {
		background-color: #4338ca;
	}

	main {
		margin-top: 70px;
	}

	footer {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 4rem 0 1.5rem;
	}

	.footer-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer-section h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: white;
	}

	.footer-section h4 {
		font-size: 1rem;
		margin-bottom: 1rem;
		color: white;
	}

	.footer-section a {
		display: block;
		color: #d1d5db;
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.2s;
	}

	.footer-section a:hover {
		color: #ffffff;
	}

	.social-links {
		display: flex;
		gap: 1rem;
	}

	.social-links a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #374151;
		color: white;
		transition: background-color 0.2s;
	}

	.social-links a:hover {
		background-color: #4f46e5;
	}

	.footer-bottom {
		text-align: center;
		padding-top: 2rem;
		border-top: 1px solid #374151;
	}

	.footer-bottom p {
		margin: 0;
		color: #9ca3af;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.auth-buttons {
			display: none;
		}
	}
</style>

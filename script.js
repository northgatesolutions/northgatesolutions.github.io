/**
 * Northgate Solutions LLC - Interactive Functions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // 3. Architectural Sizing & ROI Calculator
  const sliderServices = document.getElementById('servicesRange');
  const sliderTraffic = document.getElementById('trafficRange');
  const sliderWorkflows = document.getElementById('workflowsRange');

  const valServices = document.getElementById('servicesVal');
  const valTraffic = document.getElementById('trafficVal');
  const valWorkflows = document.getElementById('workflowsVal');

  const resultSavings = document.getElementById('resultSavings');
  const resultHours = document.getElementById('resultHours');
  const resultPods = document.getElementById('resultPods');
  const resultNodes = document.getElementById('resultNodes');

  function calculateROI() {
    if (!sliderServices || !sliderTraffic || !sliderWorkflows) return;

    const servicesCount = parseInt(sliderServices.value);
    const trafficCount = parseFloat(sliderTraffic.value); // in millions
    const workflowsCount = parseInt(sliderWorkflows.value);

    // Update range text labels
    valServices.textContent = servicesCount;
    valTraffic.textContent = trafficCount.toFixed(1);
    valWorkflows.textContent = workflowsCount;

    // Monthly Savings Formula (Placeholder logic designed to look realistic)
    // - Every million requests saved from gateway optimization saves ~$12 in infrastructure
    // - Every AI workflow saves ~15 hours of manual work at $75/hour
    // - Every microservice integration saves ~$80 in routing costs
    const monthlyCloudSavings = (trafficCount * 30 * 12.50) + (servicesCount * 65);
    const engineeringHoursSaved = Math.round((workflowsCount * 18) + (servicesCount * 4));

    // Gateway Pod & Node Sizing Recommendations
    // - At least 2 pods for HA. Add 1 pod per 5M daily requests or 15 services.
    const suggestedPods = Math.max(2, Math.ceil((trafficCount / 5) + (servicesCount / 12)));
    // - Nodes needed: min 3. Scale based on services & traffic
    const suggestedNodes = Math.max(3, Math.ceil((servicesCount / 8) + (trafficCount / 10)));

    // Animate counter display
    animateValue(resultSavings, parseInt(resultSavings.innerText.replace(/[^0-9]/g, '')) || 0, Math.round(monthlyCloudSavings), '$', '');
    animateValue(resultHours, parseInt(resultHours.innerText.replace(/[^0-9]/g, '')) || 0, engineeringHoursSaved, '', ' hrs');
    
    resultPods.textContent = `${suggestedPods} Pods`;
    resultNodes.textContent = `${suggestedNodes} Nodes`;
  }

  // Helper to animate numbers nicely
  function animateValue(obj, start, end, prefix = '', suffix = '') {
    if (start === end) {
      obj.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      return;
    }
    const duration = 400; // ms
    const range = end - start;
    let current = start;
    const increment = end > start ? Math.ceil(range / 20) : Math.floor(range / 20);
    const stepTime = Math.abs(Math.floor(duration / 20));
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        clearInterval(timer);
        obj.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      } else {
        obj.textContent = `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
      }
    }, stepTime);
  }

  // Add listeners to sliders
  if (sliderServices) sliderServices.addEventListener('input', calculateROI);
  if (sliderTraffic) sliderTraffic.addEventListener('input', calculateROI);
  if (sliderWorkflows) sliderWorkflows.addEventListener('input', calculateROI);

  // Initialize Calculator
  calculateROI();

  // 4. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const modalOverlay = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModal');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const service = document.getElementById('clientService').value;
      const message = document.getElementById('clientMessage').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Change button state to loading
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50" style="width:20px; height:20px; animation:spin 1s linear infinite; stroke:currentColor; fill:none; stroke-width:5; stroke-linecap:round;">
          <circle cx="25" cy="25" r="20"></circle>
        </svg> Processing...
      `;

      // CSS for spinner in JS to avoid clogging stylesheet
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      // Send the real request to Web3Forms API
      const formData = new FormData(contactForm);
      const json = JSON.stringify(Object.fromEntries(formData));

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 200) {
          // Show Glassmorphic Success Modal
          if (modalOverlay) {
            modalOverlay.classList.add('active');
          }
          // Reset form
          contactForm.reset();
          calculateROI(); // recalculate defaults if needed
        } else {
          // Check if it's the default placeholder key
          const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
          if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
            alert('Form submission simulated, but no email was sent because the Web3Forms Access Key is still "YOUR_ACCESS_KEY_HERE". Please register a free access key at web3forms.com and paste it in index.html (line 563) to receive real emails.');
            // Still show success modal for frontend testing purposes
            if (modalOverlay) {
              modalOverlay.classList.add('active');
            }
            contactForm.reset();
            calculateROI();
          } else {
            alert(result.message || 'Form submission failed. Please try again.');
          }
        }
      })
      .catch((error) => {
        console.error('Error during form submission:', error);
        alert('A network error occurred while submitting the form. Please check your internet connection and try again.');
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      });
    });
  }

  // Close Success Modal
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    // Close when clicking overlay backdrop
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 5. Scroll Animations (Fade-in-up items on scroll using IntersectionObserver)
  const animatedElements = document.querySelectorAll('.glass-container, .solution-card, .phone-mockup, .about-stat-card');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
});

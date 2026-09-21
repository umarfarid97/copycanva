/**
 * Modern Filipiniana Wedding Website - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const rsvpModal = document.getElementById('rsvpModal');
  const openModalBtns = document.querySelectorAll('.open-rsvp-modal');
  const closeModalBtn = document.getElementById('modalCloseBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  // --- 1. Sticky Navbar & Active Section Tracking ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active navigation link based on current scroll position
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 2. Mobile Menu Toggle ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. RSVP Modal Dialog Controls ---
  if (rsvpModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rsvpModal.showModal();
      });
    });

    const closeModal = () => {
      rsvpModal.close();
      // Reset form view
      if (rsvpForm && rsvpSuccess) {
        setTimeout(() => {
          rsvpForm.style.display = 'flex';
          rsvpSuccess.style.display = 'none';
          rsvpForm.reset();
        }, 300);
      }
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

    // Close when clicking outside modal backdrop
    rsvpModal.addEventListener('click', (e) => {
      const rect = rsvpModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });

    // Handle RSVP Form Submission
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(rsvpForm);
        const data = Object.fromEntries(formData.entries());
        console.log('RSVP Submission received:', data);

        // Transition to success screen
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
      });
    }

    // Toggle guest count based on attendance choice
    const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    attendanceInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.value === 'no') {
          if (guestCountGroup) guestCountGroup.style.display = 'none';
        } else {
          if (guestCountGroup) guestCountGroup.style.display = 'flex';
        }
      });
    });
  }
});

/**
 * Modern Filipiniana Wedding Website - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Video Intro Splash Screen Logic ---
  const videoIntroOverlay = document.getElementById('videoIntroOverlay');
  const introVideo = document.getElementById('introVideo');
  const unmuteBtn = document.getElementById('unmuteBtn');
  const soundLabel = document.getElementById('soundLabel');
  const skipVideoBtn = document.getElementById('skipVideoBtn');
  const playPrompt = document.getElementById('playPrompt');
  const startPlayBtn = document.getElementById('startPlayBtn');

  if (videoIntroOverlay && introVideo) {
    let hasTransitioned = false;

    const transitionToMainPage = () => {
      if (hasTransitioned) return;
      hasTransitioned = true;

      videoIntroOverlay.classList.add('fade-out');
      setTimeout(() => {
        videoIntroOverlay.style.display = 'none';
        introVideo.pause();
      }, 850);
    };

    // Auto transition to main page once video finishes
    introVideo.addEventListener('ended', transitionToMainPage);

    // Skip button
    if (skipVideoBtn) {
      skipVideoBtn.addEventListener('click', transitionToMainPage);
    }

    // Sound toggle button
    if (unmuteBtn) {
      unmuteBtn.addEventListener('click', () => {
        if (introVideo.muted) {
          introVideo.muted = false;
          if (soundLabel) soundLabel.textContent = 'Matikan Bunyi';
        } else {
          introVideo.muted = true;
          if (soundLabel) soundLabel.textContent = 'Buka Bunyi';
        }
      });
    }

    // Attempt autoplay
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy, show manual play button
        if (playPrompt) playPrompt.style.display = 'block';
      });
    }

    if (startPlayBtn) {
      startPlayBtn.addEventListener('click', () => {
        introVideo.play();
        if (playPrompt) playPrompt.style.display = 'none';
      });
    }
  }

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

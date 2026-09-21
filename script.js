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

  // --- 3. Inline RSVP Form Handling ---
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(rsvpForm);
      const data = Object.fromEntries(formData.entries());
      console.log('RSVP Submission received:', data);

      // Transition to success screen
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) rsvpSuccess.style.display = 'block';
    });
  }

  // Toggle guest count based on attendance choice
  const attendanceInputs = document.querySelectorAll('input[name="attendance"]');
  const guestCountGroup = document.getElementById('guestCountGroup');
  if (attendanceInputs.length > 0 && guestCountGroup) {
    attendanceInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.value === 'Tidak Hadir' || e.target.value === 'no') {
          guestCountGroup.style.display = 'none';
        } else {
          guestCountGroup.style.display = 'flex';
        }
      });
    });
  }

  // Domino pax box selection handler
  const paxBoxes = document.querySelectorAll('.pax-box');
  paxBoxes.forEach(box => {
    const radio = box.querySelector('input[type="radio"]');
    if (radio && radio.checked) box.classList.add('checked');
    if (radio) {
      radio.addEventListener('change', () => {
        paxBoxes.forEach(b => b.classList.remove('checked'));
        if (radio.checked) box.classList.add('checked');
      });
    }
  });
});

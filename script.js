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

  // --- 2. Top-Right RSVP Button Smooth Scroll ---
  const navRsvpBtn = document.getElementById('navRsvpBtn');
  if (navRsvpBtn) {
    navRsvpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const rsvpSection = document.getElementById('rsvp');
      if (rsvpSection) {
        rsvpSection.scrollIntoView({ behavior: 'smooth' });
        if (history.pushState) {
          history.pushState(null, null, '#rsvp');
        }
      }
    });
  }

  // --- Mobile Menu Toggle (if present) ---
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

  // --- 3. Inline RSVP Form & Live Wishes Handling ---
  function normalizePhone(phone) {
    if (!phone) return '';
    let cleaned = String(phone).replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('0')) {
      cleaned = '6' + cleaned;
    }
    return cleaned;
  }

  function getStoredRSVPs() {
    try {
      const stored = localStorage.getItem('wedding_rsvps_nafisya_umar_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read RSVPs from localStorage', e);
    }
    return [];
  }

  function saveRSVPs(rsvps) {
    try {
      localStorage.setItem('wedding_rsvps_nafisya_umar_v1', JSON.stringify(rsvps));
    } catch (e) {
      console.warn('Could not save RSVPs to localStorage', e);
    }
  }

  // Clear legacy mock wishes
  try {
    localStorage.removeItem('wedding_wishes_nafisya_umar_v4');
    localStorage.removeItem('wedding_wishes_live_v2');
  } catch (e) {}

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('wedding_wishes_live_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read wishes from localStorage', e);
    }
    return [];
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('wedding_wishes_live_v2', JSON.stringify(wishes));
    } catch (e) {
      console.warn('Could not save wishes to localStorage', e);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  function renderWishes(customWishes) {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;

    const wishes = Array.isArray(customWishes) ? customWishes : getStoredWishes();
    if (wishes.length === 0) {
      wishesList.innerHTML = `
        <div style="text-align: center; padding: 25px 10px; font-style: italic; color: #6f3f01; opacity: 0.85;">
          Sedang memuatkan ucapan...
        </div>
      `;
      return;
    }

    wishesList.innerHTML = wishes.map(wish => `
      <div class="wish-card">
        <h3 class="wish-sender">${escapeHtml(wish.name)}</h3>
        <p class="wish-text">${escapeHtml(wish.message)}</p>
      </div>
    `).join('');
  }

  // Initial render (if cached from Google Sheets)
  renderWishes();

  const GOOGLE_SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyJJXD4MNCT_oQy1SYQe61i06Vl7jbuLIKjQUodlDYolQg1ATnAvdkd3GAL111_Yqxg/exec';

  // Fetch live wishes directly from Google Sheets
  async function fetchWishesFromSheet() {
    if (!GOOGLE_SHEETS_ENDPOINT) return;
    try {
      const response = await fetch(`${GOOGLE_SHEETS_ENDPOINT}?t=${Date.now()}`);
      const result = await response.json();
      if (result && result.status === 'success' && Array.isArray(result.data)) {
        saveWishes(result.data);
        renderWishes(result.data);
        console.log('[Google Sheets] Loaded live wishes from sheet:', result.data.length);
      }
    } catch (err) {
      console.warn('[Google Sheets] Live wishes fetch note:', err);
    }
  }

  fetchWishesFromSheet();

  if (rsvpForm) {
    let isSubmitting = false;

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Debounce & prevent rapid double-clicks
      if (isSubmitting) return;
      isSubmitting = true;

      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sedang menghantar...";
      }
      
      const formData = new FormData(rsvpForm);
      const data = Object.fromEntries(formData.entries());
      console.log('RSVP Submission received:', data);

      const guestName = (data.guestName || '').trim() || 'Tetamu';
      const rawPhone = (data.guestPhone || '').trim();
      const normalizedPhone = normalizePhone(rawPhone);
      const attendance = data.attendance || 'Hadir';
      const guestMessage = (data.guestMessage || '').trim();
      const guestCount = attendance === 'Hadir' ? (data.guestCount || '1 Orang') : '0 Orang';

      // --- Option B: Upsert by Normalized Phone Number ---
      const storedRSVPs = getStoredRSVPs();
      const existingIndex = normalizedPhone ? storedRSVPs.findIndex(r => r.phone === normalizedPhone) : -1;
      const isUpdate = existingIndex !== -1;

      const rsvpRecord = {
        name: guestName,
        rawPhone: rawPhone,
        phone: normalizedPhone,
        attendance: attendance,
        guestCount: guestCount,
        message: guestMessage,
        updatedAt: new Date().toISOString()
      };

      if (isUpdate) {
        storedRSVPs[existingIndex] = rsvpRecord;
        console.log(`[RSVP UPSERT] Updated existing record for phone ${normalizedPhone}:`, rsvpRecord);
      } else {
        storedRSVPs.unshift(rsvpRecord);
        console.log(`[RSVP UPSERT] Created new record for phone ${normalizedPhone}:`, rsvpRecord);
      }
      saveRSVPs(storedRSVPs);

      // --- Sync to Google Sheets via Web App Webhook ---
      if (GOOGLE_SHEETS_ENDPOINT) {
        const payload = {
          guestName: guestName,
          name: guestName,
          guestPhone: rawPhone,
          phone: rawPhone,
          normalizedPhone: normalizedPhone,
          attendance: attendance,
          status: attendance,
          guestCount: guestCount,
          pax: guestCount,
          guestMessage: guestMessage,
          message: guestMessage
        };

        fetch(GOOGLE_SHEETS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
          console.log('[Google Sheets] Synced successfully:', result);
          // Refresh wishes list from Google Sheets
          fetchWishesFromSheet();
        })
        .catch(err => {
          console.warn('[Google Sheets] Sync note:', err);
        });
      }

      // Only record wish if guest actually provided a message (no hardcoded/fallback text)
      if (guestMessage) {
        const currentWishes = getStoredWishes();
        const existingWishIndex = normalizedPhone ? currentWishes.findIndex(w => w.phone && w.phone === normalizedPhone) : -1;
        const newWish = {
          name: guestName,
          phone: normalizedPhone,
          message: guestMessage
        };

        if (existingWishIndex !== -1) {
          currentWishes[existingWishIndex] = newWish;
        } else {
          currentWishes.unshift(newWish);
        }
        saveWishes(currentWishes);
        renderWishes();
      }

      // Transition to success screen after short delay
      setTimeout(() => {
        rsvpForm.style.display = 'none';
        if (rsvpSuccess) {
          rsvpSuccess.innerHTML = `
            <h3>${isUpdate ? 'Pengesahan Dikemaskini!' : 'Terima Kasih!'}</h3>
            <p>${isUpdate 
              ? `Maklumat kehadiran bagi <strong>${escapeHtml(guestName)}</strong> (${escapeHtml(rawPhone)}) telah berjaya dikemaskini: <strong>${escapeHtml(attendance)}</strong>${attendance === 'Hadir' ? ` (${escapeHtml(guestCount)})` : ''}.`
              : 'Pengesahan kehadiran anda telah selamat kami terima. Kami amat berbesar hati untuk meraikan hari bahagia ini bersama anda!'
            }</p>
            <div style="margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
              <button type="button" id="editRsvpBtn" style="padding: 10px 20px; border: 1px solid #bd8562; border-radius: 4px; color: ${isUpdate ? '#ffffff' : '#6f3f01'}; font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; background: ${isUpdate ? '#bd8562' : 'rgba(189, 133, 98, 0.1)'}; cursor: pointer; transition: all 0.2s ease;">Kemaskini Maklumat</button>
              <a href="#wishes" style="display: inline-block; padding: 10px 20px; border: 1px solid #bd8562; border-radius: 4px; color: #6f3f01; font-family: var(--font-serif); font-size: 1.05rem; font-weight: 700; text-decoration: none; background: rgba(189, 133, 98, 0.1);">Lihat Ucapan Anda &darr;</a>
            </div>
          `;
          rsvpSuccess.style.display = 'block';

          // Allow guest to re-open form and update their answers
          const editBtn = document.getElementById('editRsvpBtn');
          if (editBtn) {
            editBtn.addEventListener('click', () => {
              rsvpSuccess.style.display = 'none';
              rsvpForm.style.display = 'flex';
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "Kemaskini Kehadiran";
              }
              isSubmitting = false;
            });
          }
        }
      }, 600);
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

  // Segmented control handler for pax selection ([1|2|3|4])
  const segmentBtns = document.querySelectorAll('.segment-btn');
  segmentBtns.forEach(btn => {
    const radio = btn.querySelector('input[type="radio"]');
    if (radio && radio.checked) btn.classList.add('active');
    if (radio) {
      radio.addEventListener('change', () => {
        segmentBtns.forEach(b => b.classList.remove('active'));
        if (radio.checked) btn.classList.add('active');
      });
    }
  });

  // --- 4. Scroll-Triggered Fade In & Out Animations ---
  const scrollElements = document.querySelectorAll('.scroll-reveal');

  if (scrollElements.length > 0 && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scroll-anim');

    const observerOptions = {
      root: null,
      rootMargin: '-30px 0px -30px 0px',
      threshold: [0, 0.15]
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          el.classList.remove('out-top', 'out-bottom');
        } else {
          el.classList.remove('in-view');
          if (entry.boundingClientRect.top < 0) {
            el.classList.add('out-top');
            el.classList.remove('out-bottom');
          } else {
            el.classList.add('out-bottom');
            el.classList.remove('out-top');
          }
        }
      });
    }, observerOptions);

    scrollElements.forEach(el => {
      // Check initial position on page load
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 30 && rect.bottom > 30) {
        el.classList.add('in-view');
      } else if (rect.top < 0) {
        el.classList.add('out-top');
      } else {
        el.classList.add('out-bottom');
      }
      scrollObserver.observe(el);
    });
  }
});

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
  const defaultWishes = [
    {
      name: "Ahmad Zaki & Keluarga",
      message: "Selamat Pengantin Baru Nafisya & Umar! Semoga ikatan perkahwinan ini berkekalan hingga ke anak cucu dan sentiasa diberkati Allah SWT. Barakallahu lakuma!",
      time: "2 jam yang lalu"
    },
    {
      name: "Siti Sarah & Suami",
      message: "Tahniah Nafisya & Umar! Cantik sama padan, bagai pinang dibelah dua. Semoga rumah tangga yang dibina sentiasa dipenuhi sakinah, mawaddah wa rahmah.",
      time: "4 jam yang lalu"
    },
    {
      name: "Farhan & Rakan-rakan",
      message: "Tahniah sahabatku Umar & pasangan Nafisya! Semoga dipermudahkan segala urusan menuju hari bahagia. Tak sabar nak raikan korang nanti!",
      time: "Semalam"
    },
    {
      name: "Nurul Izzah",
      message: "Barakallah! Semoga bahtera perkahwinan ini sentiasa dilimpahi rezeki yang melimpah ruah dan kebahagiaan yang berpanjangan dunia akhirat.",
      time: "Semalam"
    },
    {
      name: "Pak Teh & Mak Teh",
      message: "Selamat melangkah ke alam perkahwinan buat Nafisya & Umar. Semoga saling melengkapi dan berbahagia bersama hingga ke syurga.",
      time: "2 hari yang lalu"
    },
    {
      name: "Hafiz & Amira",
      message: "Tahniah kedua mempelai! Semoga mahligai yang dibina sentiasa disinari kasih sayang, persefahaman, dan ketenangan jiwa.",
      time: "2 hari yang lalu"
    },
    {
      name: "Dr. Ridzwan & Dr. Farah",
      message: "Selamat Pengantin Baru! Semoga ikatan suci ini menjadi jambatan kebaikan dan rahmat buat kedua-dua keluarga besar.",
      time: "3 hari yang lalu"
    },
    {
      name: "Khairul Annuar",
      message: "Tahniah Umar & Nafisya! Selamat menempuh fasa baru dalam kehidupan. Moga kekal bahagia hingga ke jannah, insya-Allah.",
      time: "3 hari yang lalu"
    },
    {
      name: "Ainul Mardhiah",
      message: "Alhamdulillah, tahniah Nafisya si pengantin yang anggun & pasangan Umar! Semoga sentiasa dalam lindungan dan rahmat-Nya sentiasa.",
      time: "4 hari yang lalu"
    },
    {
      name: "Aiman Hakim & Batch 2019",
      message: "Congrats bro Umar & Nafisya! Akhirnya selamat disatukan. Semoga rumahtangga sentiasa ceria, harmoni dan dilimpahi rezeki.",
      time: "5 hari yang lalu"
    },
    {
      name: "Hajah Rokiah",
      message: "Syukur Alhamdulillah. Selamat menempuh alam rumahtangga buat cucunda Nafisya dan Umar. Semoga berkekalan hingga ke hujung nyawa.",
      time: "6 hari yang lalu"
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('wedding_wishes_nafisya_umar_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read wishes from localStorage', e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('wedding_wishes_nafisya_umar_v2', JSON.stringify(wishes));
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

  function renderWishes() {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;

    const wishes = getStoredWishes();
    wishesList.innerHTML = wishes.map(wish => `
      <div class="wish-card">
        <div class="wish-header">
          <h3 class="wish-sender">${escapeHtml(wish.name)}</h3>
          <span class="wish-time">${escapeHtml(wish.time || 'Baru sahaja')}</span>
        </div>
        <p class="wish-text">“${escapeHtml(wish.message)}”</p>
      </div>
    `).join('');
  }

  // Initial render of wishes
  renderWishes();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(rsvpForm);
      const data = Object.fromEntries(formData.entries());
      console.log('RSVP Submission received:', data);

      const guestName = (data.guestName || '').trim() || 'Tetamu';
      const attendance = data.attendance || 'Hadir';
      const guestMessage = (data.guestMessage || '').trim();

      const wishText = guestMessage || (attendance === 'Hadir'
        ? 'Tahniah & Selamat Pengantin Baru Nafisya & Umar! Semoga berbahagia hingga ke anak cucu.'
        : 'Tahniah Nafisya & Umar! Mendoakan kelancaran dan keberkatan buat kedua mempelai.');

      const newWish = {
        name: guestName,
        message: wishText,
        time: 'Baru sahaja'
      };

      const currentWishes = getStoredWishes();
      currentWishes.unshift(newWish);
      saveWishes(currentWishes);
      renderWishes();

      // Transition to success screen
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) {
        rsvpSuccess.innerHTML = `
          <h3>Terima Kasih!</h3>
          <p>Pengesahan kehadiran anda telah selamat kami terima. Kami amat berbesar hati untuk meraikan hari bahagia ini bersama anda!</p>
          <div style="margin-top: 22px;">
            <a href="#wishes" style="display: inline-block; padding: 10px 24px; border: 1px solid #bd8562; border-radius: 4px; color: #6f3f01; font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; text-decoration: none; background: rgba(189, 133, 98, 0.1);">Lihat Ucapan Anda di Ucapan Terkini &darr;</a>
          </div>
        `;
        rsvpSuccess.style.display = 'block';
      }
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
});

// Target Wedding Date: 2026-06-15 12:30:00 (KST)
const weddingDate = new Date('2026-06-15T12:30:00+09:00').getTime();

// D-Day Countdown Timer
function updateDday() {
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  } else {
    document.getElementById('ddayTimer').innerHTML = '<div style="font-size: 18px; font-weight: bold; color: #e07a5f; padding: 10px;">🎉 오늘이 바로 초롱이와 효진이의 결혼식입니다! 🎉</div>';
  }
}

setInterval(updateDday, 1000);
updateDday();

// Copy Address
function copyAddress() {
  const address = document.getElementById('addressText').innerText;
  copyText(address, '주소가 복사되었습니다! 네비에 붙여넣어 주세요 🚗');
}

// Universal Copy Text Helper
function copyText(text, message = '복사되었습니다!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('복사에 실패했습니다.');
  }
  document.body.removeChild(textArea);
}

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Lightbox Modal
function openModal(imgSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = imgSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Accordion
function toggleAccordion(id) {
  const target = document.getElementById(id);
  const parent = target.closest('.accordion-item');
  const isActive = parent.classList.contains('active');

  // Close all
  document.querySelectorAll('.accordion-item').forEach(item => {
    item.classList.remove('active');
  });

  if (!isActive) {
    parent.classList.add('active');
  }
}

// Add Guestbook Message
function addMessage(event) {
  event.preventDefault();
  const nameInput = document.getElementById('guestName');
  const contentInput = document.getElementById('guestContent');

  const name = nameInput.value.trim();
  const content = contentInput.value.trim();

  if (!name || !content) return;

  const list = document.getElementById('guestList');
  const newCard = document.createElement('div');
  newCard.className = 'guest-card';
  newCard.innerHTML = `
    <div class="guest-header">
      <span class="guest-author">${escapeHtml(name)} 🐾</span>
      <span class="guest-time">방금 전</span>
    </div>
    <p class="guest-msg">${escapeHtml(content)}</p>
  `;

  list.prepend(newCard);
  nameInput.value = '';
  contentInput.value = '';
  showToast('소중한 축하 메시지가 등록되었습니다! 💖');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Share Functions
function shareKakao() {
  if (navigator.share) {
    navigator.share({
      title: '김초롱 ♥ 김효진 결혼합니다 🐾',
      text: '신랑 초롱이(강아지)와 신부 효진이의 아주 특별한 결혼식에 초대합니다! 2026.06.15 강릉시 원대로179번안길 1, 3층',
      url: window.location.href,
    }).catch(() => {});
  } else {
    copyCurrentUrl();
  }
}

function copyCurrentUrl() {
  copyText(window.location.href, '청첩장 링크가 복사되었습니다! 💌');
}

// Audio Toggle (Simple pleasant chime / synth placeholder or audio status)
let isPlaying = false;
let audioCtx = null;

document.getElementById('audioToggle').addEventListener('click', function() {
  isPlaying = !isPlaying;
  const text = this.querySelector('.music-text');
  if (isPlaying) {
    text.innerText = 'BGM ON';
    this.style.background = '#fbeee8';
    this.style.borderColor = '#e07a5f';
    playWeddingMelody();
    showToast('결혼식 배경음악이 재생됩니다 🎶');
  } else {
    text.innerText = 'BGM OFF';
    this.style.background = 'rgba(255, 255, 255, 0.88)';
    this.style.borderColor = 'var(--border-subtle)';
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
  }
});

// Gentle Web Audio API Wedding March melody loop
function playWeddingMelody() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Simple warm music notes (Canon in D / Wedding feel motif)
    const notes = [
      { f: 523.25, d: 0.6 }, // C5
      { f: 493.88, d: 0.6 }, // B4
      { f: 440.00, d: 0.6 }, // A4
      { f: 392.00, d: 0.6 }, // G4
      { f: 349.23, d: 0.6 }, // F4
      { f: 329.63, d: 0.6 }, // E4
      { f: 349.23, d: 0.6 }, // F4
      { f: 392.00, d: 1.2 }  // G4
    ];

    let time = audioCtx.currentTime + 0.1;
    function scheduleLoop() {
      if (!audioCtx || audioCtx.state === 'closed') return;
      notes.forEach(n => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(time);
        osc.stop(time + n.d);
        time += n.d;
      });
      setTimeout(scheduleLoop, (time - audioCtx.currentTime) * 1000 - 200);
    }
    scheduleLoop();
  } catch (e) {
    console.log("Audio not supported or auto-blocked", e);
  }
}

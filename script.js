/**
 * Interactive Romantic Letter for Rana ❤️
 * Implements HTML5 Canvas particle system, state management, audio controllers, and timers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const preloader = document.getElementById('screen-loader');
  const lockScreen = document.getElementById('screen-lock');
  const letter1Screen = document.getElementById('screen-letter1');
  const counterScreen = document.getElementById('screen-counter');
  const finalScreen = document.getElementById('screen-final');
  
  const passwordInput = document.getElementById('password-input');
  const passwordSubmit = document.getElementById('password-submit');
  const passwordError = document.getElementById('password-error');
  
  const btnLoveTransition = document.getElementById('btn-love-transition');
  const btnContinueTransition = document.getElementById('btn-continue-transition');
  const finalHeartContainer = document.getElementById('final-heart-container');
  
  const soundControl = document.getElementById('sound-control');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const resetControl = document.getElementById('reset-control');
  const replayBtn = document.getElementById('replay-btn');
  
  const bgAudio = document.getElementById('audio-background');
  const clickAudio = document.getElementById('audio-click');
  
  // Audio sources configuration
  bgAudio.src = CONFIG.audio.background;
  bgAudio.volume = CONFIG.audio.backgroundVolume;
  clickAudio.src = CONFIG.audio.click;
  clickAudio.volume = CONFIG.audio.clickVolume;
  
  let isMuted = false;
  let counterInterval = null;
  let activeScreen = 'lock';
  let wrongAttempts = 0;

  // -------------------------------------------------------------
  // 1. PRELOADER HIDE
  // -------------------------------------------------------------
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      initAppState();
    }, 1500); // Luxury delay to display loader
  });

  // -------------------------------------------------------------
  // 2. CANVAS FLOATING HEARTS SYSTEM
  // -------------------------------------------------------------
  const canvas = document.getElementById('hearts-canvas');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const maxParticles = 35;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class HeartParticle {
    constructor() {
      this.reset();
      // Start randomly distributed on Y axis initially
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.size = Math.random() * 15 + 8; // Size between 8px and 23px
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + this.size + Math.random() * 50;
      this.speedX = Math.random() * 0.8 - 0.4; // Gentle swaying
      this.speedY = -(Math.random() * 1.0 + 0.5); // Floating up
      this.opacity = Math.random() * 0.4 + 0.15; // Semi-transparent
      this.swayValue = Math.random() * 100;
      this.swaySpeed = Math.random() * 0.02 + 0.005;
    }

    update() {
      this.y += this.speedY;
      this.swayValue += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayValue) * 0.3;

      // If off-screen top, reset to bottom
      if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      const x = this.x;
      const y = this.y;
      const size = this.size;
      
      ctx.beginPath();
      ctx.moveTo(x, y - size / 4);
      // Top right lobe
      ctx.bezierCurveTo(x + size / 2, y - size / 2, x + size, y - size / 4, x + size, y + size / 4);
      // Bottom right curve
      ctx.bezierCurveTo(x + size, y + size * 0.6, x + size * 0.5, y + size * 0.8, x, y + size);
      // Bottom left curve
      ctx.bezierCurveTo(x - size * 0.5, y + size * 0.8, x - size, y + size * 0.6, x - size, y + size / 4);
      // Top left lobe
      ctx.bezierCurveTo(x - size, y - size / 4, x - size / 2, y - size / 2, x, y - size / 4);
      
      ctx.closePath();
      ctx.fillStyle = '#ff2a5f';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ff2a5f';
      ctx.fill();
      
      ctx.restore();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new HeartParticle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // -------------------------------------------------------------
  // 3. AUDIO MANAGEMENT
  // -------------------------------------------------------------
  function playClickSound() {
    if (isMuted) return;
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => console.log('Click audio pending user interaction.'));
  }

  function startBackgroundMusic() {
    if (isMuted) return;
    bgAudio.play().then(() => {
      updateMusicButtonUI(true);
    }).catch(e => {
      console.log('Background music autoplay blocked or file missing. Waiting for user gesture.');
      updateMusicButtonUI(false);
    });
  }

  function toggleMusic() {
    playClickSound();
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        isMuted = false;
        updateMusicButtonUI(true);
      }).catch(e => console.error('Play failed: ', e));
    } else {
      bgAudio.pause();
      isMuted = true;
      updateMusicButtonUI(false);
    }
  }

  function updateMusicButtonUI(isPlaying) {
    const icon = musicToggleBtn.querySelector('i');
    if (isPlaying) {
      icon.className = 'fas fa-volume-up';
      musicToggleBtn.classList.remove('muted');
    } else {
      icon.className = 'fas fa-volume-mute';
      musicToggleBtn.classList.add('muted');
    }
  }

  // Handle browser autoplay policy via global screen tap
  document.body.addEventListener('click', () => {
    if (activeScreen !== 'lock' && bgAudio.paused && !isMuted) {
      startBackgroundMusic();
    }
  }, { once: false });

  musicToggleBtn.addEventListener('click', toggleMusic);

  // -------------------------------------------------------------
  // 4. TRANSITIONS & STATE MANAGEMENT (LOCAL STORAGE)
  // -------------------------------------------------------------
  function transitionTo(targetScreenId) {
    // Hide all screens
    const screens = [lockScreen, letter1Screen, counterScreen, finalScreen];
    
    // Find current active screen
    const currentActive = screens.find(s => s.classList.contains('active'));
    
    if (currentActive) {
      currentActive.classList.remove('active');
    }
    
    // Show target screen after brief delay to let CSS handle fade out
    setTimeout(() => {
      const target = document.getElementById(targetScreenId);
      target.classList.add('active');
      
      // Update controls visibility
      if (targetScreenId === 'screen-lock') {
        soundControl.classList.add('hidden');
        resetControl.classList.add('hidden');
        activeScreen = 'lock';
      } else {
        soundControl.classList.remove('hidden');
        resetControl.classList.remove('hidden');
        
        // Update active screen marker
        if (targetScreenId === 'screen-letter1') activeScreen = 'letter1';
        if (targetScreenId === 'screen-counter') activeScreen = 'counter';
        if (targetScreenId === 'screen-final') activeScreen = 'final';
      }

      // Trigger respective screen activations
      onScreenActive(targetScreenId);
    }, 400);
  }

  function onScreenActive(screenId) {
    // Stop any running intervals
    if (counterInterval) {
      clearInterval(counterInterval);
    }

    if (screenId === 'screen-letter1') {
      // Start letter 1 typing
      typeText('letter1-text-container', CONFIG.messages.firstMessage, () => {
        btnLoveTransition.classList.remove('hidden');
      });
      startBackgroundMusic();
    } else if (screenId === 'screen-counter') {
      // Start anniversary counter
      document.getElementById('display-date-text').textContent = CONFIG.dates.displayDate;
      document.getElementById('anniversary-description-text').textContent = CONFIG.messages.anniversaryText;
      
      initCounter();
      
      // Show continue button after 2.5 seconds
      setTimeout(() => {
        btnContinueTransition.classList.remove('hidden');
      }, 2500);
    } else if (screenId === 'screen-final') {
      // Start final letter typing
      typeText('letter2-text-container', CONFIG.messages.finalMessage, () => {
        finalHeartContainer.classList.remove('hidden');
      });
    }
  }

  function saveProgress(screenState) {
    localStorage.setItem('rana_love_progress', screenState);
  }

  function initAppState() {
    const savedProgress = localStorage.getItem('rana_love_progress');
    
    if (savedProgress === 'letter1') {
      transitionTo('screen-letter1');
    } else if (savedProgress === 'counter') {
      transitionTo('screen-counter');
    } else if (savedProgress === 'final') {
      transitionTo('screen-final');
    } else {
      transitionTo('screen-lock');
    }
  }

  // Replay Reset Trigger
  replayBtn.addEventListener('click', () => {
    playClickSound();
    if (confirm('هل ترغب في إعادة تشغيل الرسالة من البداية؟ ❤️')) {
      localStorage.removeItem('rana_love_progress');
      wrongAttempts = 0;
      bgAudio.pause();
      bgAudio.currentTime = 0;
      isMuted = false;
      btnLoveTransition.classList.add('hidden');
      btnContinueTransition.classList.add('hidden');
      finalHeartContainer.classList.add('hidden');
      document.getElementById('letter1-text-container').innerHTML = "";
      document.getElementById('letter2-text-container').innerHTML = "";
      
      transitionTo('screen-lock');
    }
  });

  // -------------------------------------------------------------
  // 5. PASSWORD LOCK VERIFICATION
  // -------------------------------------------------------------
  function checkPassword() {
    const entered = passwordInput.value.trim().toLowerCase();
    
    if (entered === CONFIG.password.toLowerCase()) {
      playClickSound();
      passwordError.classList.add('hidden');
      wrongAttempts = 0;
      saveProgress('letter1');
      transitionTo('screen-letter1');
      passwordInput.value = '';
    } else {
      wrongAttempts++;
      if (wrongAttempts === 1) {
        passwordError.textContent = CONFIG.messages.errorFirst;
      } else {
        passwordError.textContent = CONFIG.messages.errorSecond;
      }
      
      passwordError.classList.remove('hidden');
      
      // Force reflow to restart shake animation
      passwordError.style.animation = 'none';
      passwordError.offsetHeight; /* trigger reflow */
      passwordError.style.animation = null;
      
      passwordInput.focus();
      playClickSound();
    }
  }

  passwordSubmit.addEventListener('click', checkPassword);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkPassword();
    }
  });

  // -------------------------------------------------------------
  // 6. TYPEWRITER ANIMATION LIBRARY
  // -------------------------------------------------------------
  function typeText(containerId, paragraphs, onComplete) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    let paragraphIndex = 0;
    let charIndex = 0;
    let currentParagraph = null;
    
    // Create modern glow blinking cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    
    function typeChar() {
      if (paragraphIndex >= paragraphs.length) {
        cursor.remove();
        if (onComplete) onComplete();
        return;
      }
      
      if (charIndex === 0) {
        currentParagraph = document.createElement('p');
        container.appendChild(currentParagraph);
        currentParagraph.appendChild(cursor);
      }
      
      const currentText = paragraphs[paragraphIndex];
      const nextChar = currentText.charAt(charIndex);
      
      // Place character before cursor
      cursor.before(nextChar);
      charIndex++;
      
      if (charIndex >= currentText.length) {
        // Line complete, move to next paragraph after pause
        paragraphIndex++;
        charIndex = 0;
        setTimeout(typeChar, 700);
      } else {
        // Typing characters
        setTimeout(typeChar, CONFIG.typingSpeed);
      }
      
      // Keep viewport scrolled to bottom in container view
      const wrapper = container.closest('.letter-wrapper');
      if (wrapper) {
        wrapper.scrollTop = wrapper.scrollHeight;
      }
    }
    
    typeChar();
  }

  // -------------------------------------------------------------
  // 7. ANNIVERSARY LIVE TIME COUNTER
  // -------------------------------------------------------------
  function updateCounter() {
    const startDate = new Date(CONFIG.dates.counterStart);
    const now = new Date();
    const difference = now.getTime() - startDate.getTime();

    if (difference < 0) {
      // Counter not yet started
      document.getElementById('days-val').textContent = "00";
      document.getElementById('hours-val').textContent = "00";
      document.getElementById('minutes-val').textContent = "00";
      document.getElementById('seconds-val').textContent = "00";
      return;
    }

    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    const days = Math.floor(difference / msPerDay);
    const hours = Math.floor((difference % msPerDay) / msPerHour);
    const minutes = Math.floor((difference % msPerHour) / msPerMinute);
    const seconds = Math.floor((difference % msPerMinute) / msPerSecond);

    // Format numbers to always display 2 digits
    document.getElementById('days-val').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours-val').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes-val').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds-val').textContent = seconds.toString().padStart(2, '0');
  }

  function initCounter() {
    updateCounter();
    counterInterval = setInterval(updateCounter, 1000);
  }

  // -------------------------------------------------------------
  // 8. SCREEN TRANSITIONS BINDINGS
  // -------------------------------------------------------------
  btnLoveTransition.addEventListener('click', () => {
    playClickSound();
    saveProgress('counter');
    transitionTo('screen-counter');
  });

  btnContinueTransition.addEventListener('click', () => {
    playClickSound();
    saveProgress('final');
    transitionTo('screen-final');
  });
});

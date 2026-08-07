// =============================================
// SPOT THE DIFFERENCE - GAME ENGINE
// =============================================

// ===== DOM ELEMENTS =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('msg');
const foundEl = document.getElementById('found');
const totalEl = document.getElementById('total');
const timerEl = document.getElementById('timer');
const bestEl = document.getElementById('best');

// ===== GAME STATE =====
let state = {
  diffs: [],
  found: 0,
  total: 5,
  time: 60,
  timer: null,
  best: parseInt(localStorage.getItem('spotBest')) || 0,
  gameOver: false,
  active: false,
  difficulty: 5
};

// ===== INITIALIZE =====
bestEl.textContent = state.best;
totalEl.textContent = state.total;

// =============================================
// DIFFICULTY BUTTONS
// =============================================
document.querySelectorAll('.difficulty button').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.difficulty button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    state.difficulty = parseInt(this.dataset.diff);
    state.total = state.difficulty;
    totalEl.textContent = state.total;
    newRound();
  };
});

// =============================================
// GENERATE RANDOM IMAGE (NO IMAGE FILES NEEDED!)
// =============================================
function generateImage(withDiffs) {
  const w = 400;
  const h = 400;
  ctx.clearRect(0, 0, w, h);
  
  // === Background ===
  const hue1 = 200 + Math.random() * 60;
  const hue2 = 240 + Math.random() * 60;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, `hsl(${hue1}, 30%, 15%)`);
  grad.addColorStop(1, `hsl(${hue2}, 30%, 10%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // === Random Shapes (circles, squares, triangles) ===
  const colors = [];
  for (let i = 0; i < 3; i++) {
    colors.push(`hsl(${Math.random() * 360}, 70%, 50%)`);
  }
  
  for (let i = 0; i < 12 + Math.floor(Math.random() * 6); i++) {
    const x = 30 + Math.random() * 340;
    const y = 30 + Math.random() * 340;
    const size = 18 + Math.random() * 35;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = Math.floor(Math.random() * 3);
    
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    
    if (type === 0) {
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 1) {
      // Rectangle
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
      // Triangle
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // === Draw Differences ===
  if (withDiffs) {
    withDiffs.forEach(diff => {
      // Add a subtle color shift
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = `hsla(${Math.random() * 360}, 80%, 50%, 0.3)`;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Add a small visible change nearby
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(diff.x + 15 + Math.random() * 20, diff.y + 15 + Math.random() * 20, 8 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // === Grid Overlay ===
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }
  for (let i = 0; i < h; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);
    ctx.stroke();
  }
}

// =============================================
// GENERATE DIFFERENCES
// =============================================
function generateDiffs(count) {
  const diffs = [];
  const padding = 50;
  const minDist = 70;
  
  for (let i = 0; i < count; i++) {
    let x, y, valid;
    let attempts = 0;
    
    do {
      x = padding + Math.random() * (400 - padding * 2);
      y = padding + Math.random() * (400 - padding * 2);
      valid = true;
      
      for (const d of diffs) {
        const dx = d.x - x;
        const dy = d.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          valid = false;
          break;
        }
      }
      attempts++;
    } while (!valid && attempts < 50);
    
    diffs.push({
      x: x,
      y: y,
      radius: 12 + Math.random() * 18,
      found: false
    });
  }
  return diffs;
}

// =============================================
// NEW ROUND
// =============================================
function newRound() {
  // Clear existing timer
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
  
  // Reset state
  state.found = 0;
  state.time = 60;
  state.gameOver = false;
  state.active = true;
  state.diffs = generateDiffs(state.total);
  
  // Update display
  foundEl.textContent = '0';
  timerEl.textContent = '60';
  msg.textContent = '🔍 Tap the differences!';
  msg.className = 'message';
  
  // Generate image
  generateImage(state.diffs);
  
  // Start timer
  state.timer = setInterval(() => {
    state.time--;
    timerEl.textContent = state.time;
    
    if (state.time <= 0) {
      clearInterval(state.timer);
      state.timer = null;
      state.gameOver = true;
      state.active = false;
      msg.textContent = '⏰ Time\'s up! Tap "New Round"';
      msg.className = 'message fail';
    }
  }, 1000);
}

// =============================================
// RESET GAME
// =============================================
function resetGame() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
  
  state.gameOver = true;
  state.active = false;
  state.found = 0;
  
  foundEl.textContent = '0';
  timerEl.textContent = '60';
  msg.textContent = '🔄 Game reset. Tap "New Round" to start!';
  msg.className = 'message';
  
  ctx.clearRect(0, 0, 400, 400);
}

// =============================================
// HANDLE CANVAS CLICK
// =============================================
function handleCanvasClick(e) {
  if (state.gameOver || !state.active) return;
  
  // Get click position
  const rect = canvas.getBoundingClientRect();
  const scaleX = 400 / rect.width;
  const scaleY = 400 / rect.height;
  
  let clientX, clientY;
  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
    e.preventDefault();
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  
  // Check if clicked on a difference
  let hit = false;
  for (const diff of state.diffs) {
    if (diff.found) continue;
    
    const dx = diff.x - x;
    const dy = diff.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < diff.radius + 12) {
      diff.found = true;
      state.found++;
      foundEl.textContent = state.found;
      hit = true;
      
      // Draw green circle marker
      ctx.save();
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(76, 175, 80, 0.5)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      
      // Check if all differences found
      if (state.found === state.total) {
        clearInterval(state.timer);
        state.timer = null;
        state.active = false;
        
        const timeBonus = Math.floor(state.time * 0.5);
        const score = state.total * 10 + timeBonus;
        
        if (score > state.best) {
          state.best = score;
          localStorage.setItem('spotBest', state.best);
          bestEl.textContent = state.best;
          msg.textContent = `🏆 NEW BEST! ${score} points! 🎉`;
        } else {
          msg.textContent = `🎉 All found! Score: ${score}`;
        }
        msg.className = 'message success';
      } else {
        msg.textContent = `✅ Found! ${state.found}/${state.total}`;
        msg.className = 'message success';
      }
      break;
    }
  }
  
  if (!hit) {
    msg.textContent = '❌ No difference there! Keep looking.';
    msg.className = 'message fail';
    
    setTimeout(() => {
      if (!state.gameOver && state.active) {
        msg.textContent = `🔍 ${state.found}/${state.total} found`;
        msg.className = 'message';
      }
    }, 700);
  }
}

// =============================================
// EVENT LISTENERS
// =============================================
canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('touchstart', handleCanvasClick, { passive: false });

// =============================================
// AUTO-START GAME
// =============================================
setTimeout(newRound, 400);

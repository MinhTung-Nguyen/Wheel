const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('result');
const logList = document.getElementById('log');

const sections = 20; // Số lượng ô
const players = 8; // Số người chơi
const maxTurns = 3; // Số lần quay tối đa cho mỗi người chơi
const radius = canvas.width / 2;

let currentPlayer = 0;
let turnsLeft = Array(players).fill(maxTurns);
let results = Array(players).fill([]);

// Vẽ vòng quay
function drawWheel() {
  const angleStep = (2 * Math.PI) / sections;

  for (let i = 0; i < sections; i++) {
    const startAngle = i * angleStep;
    const endAngle = startAngle + angleStep;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#ff9900';
    ctx.fill();
    ctx.stroke();

    // Số trên vòng quay
    const textAngle = startAngle + angleStep / 2;
    const x = radius + (radius - 40) * Math.cos(textAngle);
    const y = radius + (radius - 40) * Math.sin(textAngle);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(textAngle);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i + 1, 0, 0);
    ctx.restore();
  }
}

// Quay vòng
function spinWheel() {
  spinButton.disabled = true;
  let spinAngle = Math.random() * 360 + 720; // Tối thiểu 2 vòng
  const spinSpeed = 10;

  const interval = setInterval(() => {
    spinAngle -= spinSpeed;
    const currentAngle = (spinAngle % 360) * (Math.PI / 180);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentAngle);
    drawWheel();
    ctx.restore();

    if (spinAngle <= 0) {
      clearInterval(interval);
      const finalAngle = (360 - (spinAngle % 360)) % 360;
      const sectionIndex = Math.floor(finalAngle / (360 / sections));
      const result = sectionIndex + 1;

      recordResult(result);
      spinButton.disabled = false;
    }
  }, 20);
}

// Ghi lại kết quả
function recordResult(result) {
  results[currentPlayer].push(result);
  resultText.textContent = `Người chơi ${currentPlayer + 1} quay được số: ${result}`;
  updateLog();

  if (--turnsLeft[currentPlayer] === 0) {
    currentPlayer++;
    if (currentPlayer >= players) {
      spinButton.disabled = true;
      resultText.textContent = 'Tất cả người chơi đã hoàn thành!';
    }
  }
}

// Cập nhật log kết quả
function updateLog() {
  logList.innerHTML = '';
  results.forEach((res, index) => {
    const playerLog = document.createElement('li');
    playerLog.textContent = `Người chơi ${index + 1}: ${res.join(', ')}`;
    logList.appendChild(playerLog);
  });
}

// Khởi tạo
drawWheel();

spinButton.addEventListener('click', spinWheel);

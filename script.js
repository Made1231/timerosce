let timerInterval;
let totalDetik = 0;
let peringatanDetik = 0;
let sisaDetik = 0;
let reminderPlayed = false;
let timerAktif = false;
let startSoundPlayed = false;

const startSound = document.getElementById("startSound");
const reminderSound = document.getElementById("reminderSound");
const endSound = document.getElementById("endSound");

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
    page.classList.remove('active');
  });
  const active = document.getElementById(id);
  active.style.display = 'block';
  setTimeout(() => active.classList.add('active'), 10);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none";
    showPage("home");
  }, 1500);
});

function persiapanMulai() {
  const totalInput = parseInt(document.getElementById("totalWaktu").value);
  const peringatanInput = parseInt(document.getElementById("peringatanWaktu").value);

  if (isNaN(totalInput) || isNaN(peringatanInput) || totalInput <= 0 || peringatanInput <= 0 || peringatanInput >= totalInput) {
    alert("Masukkan waktu yang valid! Peringatan harus lebih kecil dari total.");
    return;
  }

  totalDetik = totalInput * 60;
  peringatanDetik = (totalInput - peringatanInput) * 60;
  sisaDetik = totalDetik;
  reminderPlayed = false;

  disableButtons(true);

  if (!startSoundPlayed) {
    startSoundPlayed = true;
    startSound.play();
    startSound.onended = () => mulaiTimer();
  } else {
    mulaiTimer();
  }
}

function mulaiTimer() {
  if (timerAktif) return;
  timerAktif = true;

  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
  document.getElementById("skipBtn").disabled = false;

  timerInterval = setInterval(() => {
    sisaDetik--;
    updateDisplay();

    if (sisaDetik === peringatanDetik && !reminderPlayed) {
      reminderSound.play();
      reminderPlayed = true;
    }

    if (sisaDetik <= 0) {
      clearInterval(timerInterval);
      endSound.play();
      timerAktif = false;
      disableButtons(false, true);
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerAktif = false;
  pauseAllSounds();

  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
  document.getElementById("skipBtn").disabled = true;
}

function restartTimer() {
  clearInterval(timerInterval);
  pauseAllSounds();
  startSoundPlayed = false;

  const totalInput = parseInt(document.getElementById("totalWaktu").value);
  const peringatanInput = parseInt(document.getElementById("peringatanWaktu").value);

  if (isNaN(totalInput) || isNaN(peringatanInput) || totalInput <= 0 || peringatanInput <= 0 || peringatanInput >= totalInput) {
    alert("Masukkan waktu yang valid untuk restart.");
    return;
  }

  totalDetik = totalInput * 60;
  peringatanDetik = (totalInput - peringatanInput) * 60;
  sisaDetik = totalDetik;
  reminderPlayed = false;

  document.querySelectorAll('.digit, .colon').forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });

  updateDisplay();
  disableButtons(false);
}

function skipTime() {
  sisaDetik = Math.max(0, sisaDetik - 60);
  updateDisplay();
}

function updateDisplay() {
  const minutes = String(Math.floor(Math.max(sisaDetik, 0) / 60)).padStart(2, '0');
  const seconds = String(Math.max(sisaDetik, 0) % 60).padStart(2, '0');

  document.getElementById("min1").textContent = minutes[0];
  document.getElementById("min2").textContent = minutes[1];
  document.getElementById("sec1").textContent = seconds[0];
  document.getElementById("sec2").textContent = seconds[1];
}

function disableButtons(startDisabled, finished = false) {
  document.getElementById("startBtn").disabled = startDisabled;
  document.getElementById("stopBtn").disabled = finished;
  document.getElementById("restartBtn").disabled = false;
  document.getElementById("skipBtn").disabled = finished;
}

function pauseAllSounds() {
  [startSound, reminderSound, endSound].forEach(sound => sound.pause());
}

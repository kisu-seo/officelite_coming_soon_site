// --- Countdown Timer Logic ---

/**
 * 카운트다운 대상 날짜를 가져오거나 생성합니다.
 * 최초 방문 시 로컬 스토리지에 30일 뒤 날짜를 저장하여 세션이 바뀌어도 일관되게 동작하도록 합니다.
 */
function getTargetDate() {
  let target = localStorage.getItem('officelite_target_date');
  if (!target) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    target = targetDate.toISOString();
    localStorage.setItem('officelite_target_date', target);
  }
  return new Date(target);
}

const targetDate = getTargetDate();

/**
 * 날짜 포맷팅 (예: "4 Nov 2020" -> "17 Jul 2026")
 */
function formatTargetDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// 대상 날짜 문자열 업데이트
const targetDateElements = document.querySelectorAll('.target-date-display');
const formattedStr = formatTargetDate(targetDate);
targetDateElements.forEach(el => {
  el.textContent = formattedStr.toUpperCase();
});

/**
 * 남은 시간 계산 및 UI 업데이트
 */
function updateTimer() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    // 만료 시 처리
    document.querySelectorAll('.timer-days').forEach(el => el.textContent = '00');
    document.querySelectorAll('.timer-hours').forEach(el => el.textContent = '00');
    document.querySelectorAll('.timer-mins').forEach(el => el.textContent = '00');
    document.querySelectorAll('.timer-secs').forEach(el => el.textContent = '00');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  // 화면 업데이트 (두 자리 포맷)
  document.querySelectorAll('.timer-days').forEach(el => el.textContent = String(days).padStart(2, '0'));
  document.querySelectorAll('.timer-hours').forEach(el => el.textContent = String(hours).padStart(2, '0'));
  document.querySelectorAll('.timer-mins').forEach(el => el.textContent = String(mins).padStart(2, '0'));
  document.querySelectorAll('.timer-secs').forEach(el => el.textContent = String(secs).padStart(2, '0'));
}

// 최초 실행 및 주기적 업데이트 등록
updateTimer();
setInterval(updateTimer, 1000);

// --- Sign Up Page Logic ---

/**
 * URL 파라미터에서 선택된 팩(Pack) 정보를 가져와 셀렉트 박스 기본값을 설정합니다.
 */
function initSelectedPack() {
  const params = new URLSearchParams(window.location.search);
  const pack = params.get('pack');
  
  const options = {
    'basic': { text: 'Basic Pack', price: 'Free', value: 'basic' },
    'pro': { text: 'Pro Pack', price: '$9.99', value: 'pro' },
    'ultimate': { text: 'Ultimate Pack', price: '$19.99', value: 'ultimate' }
  };

  const selected = options[pack] || options['basic'];
  updateSelectValue(selected.text, selected.price, selected.value);
}

// 커스텀 셀렉트 관련 요소들
const selectTrigger = document.getElementById('custom-select-trigger');
const selectOptionsList = document.getElementById('custom-select-options');
const hiddenSelectInput = document.getElementById('hidden-pack-input');
const optionElements = document.querySelectorAll('.select-option');

/**
 * 커스텀 셀렉트 박스 값 업데이트
 */
function updateSelectValue(text, price, value) {
  const textEl = selectTrigger.querySelector('.selected-text');
  const priceEl = selectTrigger.querySelector('.selected-price');
  
  textEl.textContent = text;
  priceEl.textContent = price;
  hiddenSelectInput.value = value;

  // 체크 아이콘(check icon) 상태 업데이트
  optionElements.forEach(option => {
    const isSelected = option.dataset.value === value;
    const checkIcon = option.querySelector('.check-icon');
    
    if (isSelected) {
      option.classList.add('font-bold', 'text-neutral-900');
      option.classList.remove('text-neutral-500');
      checkIcon.classList.remove('hidden');
    } else {
      option.classList.remove('font-bold', 'text-neutral-900');
      option.classList.add('text-neutral-500');
      checkIcon.classList.add('hidden');
    }
  });
}

// 셀렉트 박스 드롭다운 토글
selectTrigger.addEventListener('click', (e) => {
  const isExpanded = selectTrigger.getAttribute('aria-expanded') === 'true';
  selectTrigger.setAttribute('aria-expanded', !isExpanded);
  selectOptionsList.classList.toggle('hidden');
});

// 외부 클릭 시 드롭다운 닫기
document.addEventListener('click', (e) => {
  if (!selectTrigger.contains(e.target) && !selectOptionsList.contains(e.target)) {
    selectTrigger.setAttribute('aria-expanded', 'false');
    selectOptionsList.classList.add('hidden');
  }
});

// 옵션 선택 클릭 이벤트 바인딩
optionElements.forEach(option => {
  option.addEventListener('click', () => {
    const text = option.querySelector('.option-text').textContent;
    const price = option.querySelector('.option-price').textContent;
    const value = option.dataset.value;
    
    updateSelectValue(text, price, value);
    selectTrigger.setAttribute('aria-expanded', 'false');
    selectOptionsList.classList.add('hidden');
  });

  // 키보드 엔터(Enter) 접근성 지원
  option.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      option.click();
    }
  });
});

// 키보드 포커스 아웃 시 닫기 지원
selectTrigger.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    selectTrigger.setAttribute('aria-expanded', 'false');
    selectOptionsList.classList.add('hidden');
    selectTrigger.focus();
  }
});

// --- Form Validation (가입 폼 유효성 검사) ---

const signupForm = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

/**
 * 이메일 포맷 정규식 검사
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * 에러 스타일 및 메시지 노출
 */
function showError(inputEl, message) {
  const container = inputEl.closest('.input-container');
  container.classList.add('has-error');
  
  const errorText = container.querySelector('.error-message');
  if (errorText) {
    errorText.textContent = message;
    errorText.classList.remove('hidden');
  }

  const errorIcon = container.querySelector('.error-icon');
  if (errorIcon) {
    errorIcon.classList.remove('hidden');
  }

  inputEl.setAttribute('aria-invalid', 'true');
}

/**
 * 에러 해제
 */
function clearError(inputEl) {
  const container = inputEl.closest('.input-container');
  container.classList.remove('has-error');
  
  const errorText = container.querySelector('.error-message');
  if (errorText) {
    errorText.classList.add('hidden');
  }

  const errorIcon = container.querySelector('.error-icon');
  if (errorIcon) {
    errorIcon.classList.add('hidden');
  }

  inputEl.setAttribute('aria-invalid', 'false');
}

// 실시간 입력 감지 시 에러 초기화
nameInput.addEventListener('input', () => {
  if (nameInput.value.trim() !== '') {
    clearError(nameInput);
  }
});

emailInput.addEventListener('input', () => {
  if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value.trim())) {
    clearError(emailInput);
  }
});

// 폼 서브밋 이벤트 처리
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // 이름 검사
  const nameVal = nameInput.value.trim();
  if (nameVal === '') {
    showError(nameInput, "Can't be empty");
    valid = false;
  } else {
    clearError(nameInput);
  }

  // 이메일 검사
  const emailVal = emailInput.value.trim();
  if (emailVal === '') {
    showError(emailInput, "Can't be empty");
    valid = false;
  } else if (!isValidEmail(emailVal)) {
    showError(emailInput, "Please use a valid email address");
    valid = false;
  } else {
    clearError(emailInput);
  }

  // 유효할 경우 성공 메시지 표시
  if (valid) {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
      successModal.classList.remove('hidden');
      signupForm.reset();
      initSelectedPack();
    }
  }
});

// 성공 모달 닫기
const closeModalBtn = document.getElementById('close-modal-btn');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => {
    document.getElementById('success-modal').classList.add('hidden');
  });
}

// 초기화 호출
initSelectedPack();

<template>
  <div ref="appRef" class="calculator-app" tabindex="-1" @keydown="handleKeydown">
    <div class="display">
      <div class="history">{{ historyExpression }}</div>
      <div class="current" :class="{ 'is-small': currentVal.length > 10 }">
        {{ formattedCurrentVal }}
      </div>
    </div>

    <div class="keypad">
      <button class="action" @click="clearAll">C</button>
      <button class="action" @click="clearEntry">CE</button>
      <button class="action" @click="toggleSign">+/-</button>
      <button class="operator" :class="{ active: operator === '÷' }" @click="setOperator('÷')">
        ÷
      </button>

      <button class="number" @click="appendNumber('7')">7</button>
      <button class="number" @click="appendNumber('8')">8</button>
      <button class="number" @click="appendNumber('9')">9</button>
      <button class="operator" :class="{ active: operator === '×' }" @click="setOperator('×')">
        ×
      </button>

      <button class="number" @click="appendNumber('4')">4</button>
      <button class="number" @click="appendNumber('5')">5</button>
      <button class="number" @click="appendNumber('6')">6</button>
      <button class="operator" :class="{ active: operator === '-' }" @click="setOperator('-')">
        −
      </button>

      <button class="number" @click="appendNumber('1')">1</button>
      <button class="number" @click="appendNumber('2')">2</button>
      <button class="number" @click="appendNumber('3')">3</button>
      <button class="operator" :class="{ active: operator === '+' }" @click="setOperator('+')">
        +
      </button>

      <button class="number double" @click="appendNumber('0')">0</button>
      <button class="number" @click="appendDecimal">.</button>
      <button class="operator equals" @click="calculate">=</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const appRef = ref<HTMLDivElement | null>(null);

const currentVal = ref('0');
const previousVal = ref<string | null>(null);
const operator = ref<string | null>(null);
const waitingForNext = ref(false);

const historyExpression = computed(() => {
  if (previousVal.value !== null && operator.value) {
    return `${formatNumber(previousVal.value)} ${operator.value}`;
  }
  return '';
});

const formattedCurrentVal = computed(() => {
  if (currentVal.value === 'Error') return t('os.apps.calculator.error');
  if (currentVal.value === 'Infinity') return '∞';
  if (currentVal.value === '-Infinity') return '-∞';

  if (currentVal.value.endsWith('.')) {
    return formatNumber(currentVal.value.slice(0, -1)) + '.';
  }
  return formatNumber(currentVal.value);
});

const formatNumber = (numStr: string) => {
  if (isNaN(Number(numStr)) || numStr === '' || numStr === '-') return numStr;

  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  let formattedInteger = '';
  if (integerPart) {
    const isNegative = integerPart.startsWith('-');
    const numToFormat = isNegative ? integerPart.substring(1) : integerPart;
    formattedInteger = numToFormat.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (isNegative) formattedInteger = '-' + formattedInteger;
  }

  return formattedInteger + decimalPart;
};

const appendNumber = (num: string) => {
  if (currentVal.value === 'Error') clearAll();

  if (waitingForNext.value) {
    currentVal.value = num;
    waitingForNext.value = false;
  } else {
    currentVal.value = currentVal.value === '0' ? num : currentVal.value + num;
  }
};

const appendDecimal = () => {
  if (currentVal.value === 'Error') clearAll();

  if (waitingForNext.value) {
    currentVal.value = '0.';
    waitingForNext.value = false;
    return;
  }
  if (!currentVal.value.includes('.')) {
    currentVal.value += '.';
  }
};

const clearAll = () => {
  currentVal.value = '0';
  previousVal.value = null;
  operator.value = null;
  waitingForNext.value = false;
};

const clearEntry = () => {
  if (waitingForNext.value) {
    clearAll();
  } else {
    currentVal.value = '0';
  }
};

const toggleSign = () => {
  if (currentVal.value === 'Error') return;
  if (currentVal.value === '0') return;

  if (currentVal.value.startsWith('-')) {
    currentVal.value = currentVal.value.substring(1);
  } else {
    currentVal.value = '-' + currentVal.value;
  }
};

const setOperator = (op: string) => {
  if (currentVal.value === 'Error') clearAll();

  if (operator.value && !waitingForNext.value && previousVal.value !== null) {
    calculate();
  }
  previousVal.value = currentVal.value;
  operator.value = op;
  waitingForNext.value = true;
};

const calculate = () => {
  if (operator.value === null || previousVal.value === null || waitingForNext.value) return;

  const prev = parseFloat(previousVal.value);
  const curr = parseFloat(currentVal.value);
  let res = 0;

  switch (operator.value) {
    case '+':
      res = prev + curr;
      break;
    case '-':
      res = prev - curr;
      break;
    case '×':
      res = prev * curr;
      break;
    case '÷':
      if (curr === 0) {
        currentVal.value = 'Error';
        operator.value = null;
        previousVal.value = null;
        waitingForNext.value = true;
        return;
      }
      res = prev / curr;
      break;
  }

  res = Math.round(res * 1000000000) / 1000000000;

  currentVal.value = res.toString();

  operator.value = null;
  previousVal.value = null;
  waitingForNext.value = true;
};

const handleKeydown = (e: KeyboardEvent) => {
  const key = e.key;
  if (/[0-9]/.test(key)) {
    appendNumber(key);
  } else if (key === '.' || key === ',') {
    appendDecimal();
  } else if (key === '+') {
    setOperator('+');
  } else if (key === '-') {
    setOperator('-');
  } else if (key === '*' || key === 'x') {
    setOperator('×');
  } else if (key === '/' || key === '÷') {
    e.preventDefault();
    setOperator('÷');
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
  } else if (key === 'Escape') {
    clearAll();
  } else if (key === 'Backspace') {
    if (!waitingForNext.value) {
      if (currentVal.value.length > 1) {
        if (currentVal.value.length === 2 && currentVal.value.startsWith('-')) {
          currentVal.value = '0';
        } else {
          currentVal.value = currentVal.value.slice(0, -1);
        }
      } else {
        currentVal.value = '0';
      }
    }
  }
};

onMounted(() => {
  nextTick(() => {
    appRef.value?.focus();
  });
});
</script>

<style scoped lang="scss">
.calculator-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  color: var(--os-text, #fff);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  outline: none;
}

.display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px 20px;
  background: color-mix(in srgb, var(--os-window-bg) 60%, rgba(0, 0, 0, 0.2));
  border-radius: 16px;
  margin-bottom: 20px;
  height: 140px;
  min-height: 140px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 30%, transparent);

  .history {
    font-size: 16px;
    color: color-mix(in srgb, var(--os-text) 50%, transparent);
    min-height: 20px;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
  }
  .current {
    font-size: 48px;
    font-weight: 300;
    letter-spacing: -1px;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-variant-numeric: tabular-nums;
    transition: font-size 0.2s;

    &.is-small {
      font-size: 32px;
    }
  }
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 12px;
  flex: 1;

  button {
    border: none;
    border-radius: 12px;
    font-size: 22px;
    font-weight: 400;
    cursor: pointer;
    background: color-mix(in srgb, var(--os-window-bg) 80%, rgba(255, 255, 255, 0.05));
    color: var(--os-text);
    border: 1px solid color-mix(in srgb, var(--os-border, #444) 20%, transparent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: color-mix(in srgb, var(--os-window-bg) 60%, rgba(255, 255, 255, 0.1));
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
      background: color-mix(in srgb, var(--os-window-bg) 90%, rgba(0, 0, 0, 0.15));
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &.action {
      background: color-mix(in srgb, var(--os-window-bg) 70%, rgba(255, 255, 255, 0.15));
      color: color-mix(in srgb, var(--os-text) 90%, transparent);
      font-weight: 500;
    }

    &.operator {
      background: color-mix(in srgb, #0078d4 15%, transparent);
      color: #0078d4;
      border-color: color-mix(in srgb, #0078d4 30%, transparent);
      font-size: 26px;
      font-weight: 500;

      &:hover {
        background: color-mix(in srgb, #0078d4 25%, transparent);
      }

      &.active {
        background: color-mix(in srgb, #0078d4 35%, transparent);
        border-color: color-mix(in srgb, #0078d4 50%, transparent);
      }
    }

    &.equals {
      background: #0078d4;
      color: white;
      border-color: #0078d4;
      font-size: 26px;

      &:hover {
        background: #006abc;
        border-color: #006abc;
      }

      &:active {
        background: #005a9e;
      }
    }

    &.double {
      grid-column: span 2;
    }
  }
}
</style>

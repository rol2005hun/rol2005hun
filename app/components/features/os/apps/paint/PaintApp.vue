<template>
  <div class="paint-app">
    <div class="toolbar">
      <div class="tools">
        <label for="colorPicker" class="tool-label">{{ $t('os.apps.paint.color') }}</label>
        <input id="colorPicker" v-model="color" type="color" class="color-picker" />

        <label for="brushSize" class="tool-label">{{ $t('os.apps.paint.size') }}</label>
        <input
          id="brushSize"
          v-model.number="brushSize"
          type="range"
          min="1"
          max="50"
          class="size-slider" />
        <span class="size-value">{{ brushSize }}px</span>
      </div>

      <div class="actions">
        <button class="action-btn" @click="clearCanvas">
          <Icon name="ph:trash-bold" />
          {{ $t('os.apps.paint.clear') }}
        </button>
        <button class="action-btn primary" @click="saveImage">
          <Icon name="ph:download-simple-bold" />
          {{ $t('os.apps.paint.save') }}
        </button>
      </div>
    </div>

    <div ref="containerRef" class="canvas-container">
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawingTouch"
        @touchmove.prevent="drawTouch"
        @touchend.prevent="stopDrawing"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const isDrawing = ref(false);
const color = ref('#000000');
const brushSize = ref(5);
let ctx: CanvasRenderingContext2D | null = null;
let lastX = 0;
let lastY = 0;

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  let tempCanvas = document.createElement('canvas');
  let tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  if (tempCtx && canvas.width > 0) {
    tempCtx.drawImage(canvas, 0, 0);
  }

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    if (tempCanvas.width > 0) {
      ctx.drawImage(tempCanvas, 0, 0);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
};

onMounted(() => {
  // Use a slight delay or resizeObserver for better accuracy on first mount,
  // but a direct call works if container is already sized.
  setTimeout(() => {
    resizeCanvas();
  }, 100);
  window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});

const getCoordinates = (e: MouseEvent | TouchEvent): [number, number] => {
  const canvas = canvasRef.value;
  if (!canvas) return [0, 0];

  const rect = canvas.getBoundingClientRect();

  if ('touches' in e) {
    return [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
  } else {
    return [e.clientX - rect.left, e.clientY - rect.top];
  }
};

const startDrawing = (e: MouseEvent) => {
  if (e.button !== 0) return; // Only left click
  isDrawing.value = true;
  const coords = getCoordinates(e);
  lastX = coords[0];
  lastY = coords[1];
};

const startDrawingTouch = (e: TouchEvent) => {
  isDrawing.value = true;
  const coords = getCoordinates(e);
  lastX = coords[0];
  lastY = coords[1];
};

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx) return;
  const coords = getCoordinates(e);
  const currentX = coords[0];
  const currentY = coords[1];

  ctx.strokeStyle = color.value;
  ctx.lineWidth = brushSize.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  lastX = currentX;
  lastY = currentY;
};

const drawTouch = (e: TouchEvent) => {
  if (!isDrawing.value || !ctx) return;
  const coords = getCoordinates(e);
  const currentX = coords[0];
  const currentY = coords[1];

  ctx.strokeStyle = color.value;
  ctx.lineWidth = brushSize.value;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  lastX = currentX;
  lastY = currentY;
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clearCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const saveImage = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = 'paint-drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};
</script>

<style scoped lang="scss">
.paint-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  color: var(--os-text, #fff);
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: color-mix(in srgb, var(--os-window-bg) 80%, var(--os-border, #ccc));
  border-bottom: 1px solid var(--os-border, #333);
  gap: 10px;
  flex-wrap: wrap;

  .tools,
  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.tool-label {
  font-size: 14px;
  font-weight: 500;
}

.color-picker {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.size-slider {
  cursor: pointer;
}

.size-value {
  font-size: 12px;
  min-width: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--os-window-bg);
  border: 1px solid var(--os-border, #555);
  border-radius: 6px;
  color: var(--os-text);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--os-window-bg) 80%, white);
  }

  &.primary {
    background: #0078d4;
    color: white;
    border-color: #0078d4;

    &:hover {
      background: #006abc;
    }
  }
}

.canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  canvas {
    cursor: crosshair;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    touch-action: none;
  }
}
</style>

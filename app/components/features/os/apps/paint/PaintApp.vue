<template>
  <div class="paint-app">
    <div class="toolbar">
      <div class="toolbar-section">
        <div class="tools-group">
          <button
            v-for="tool in availableTools"
            :key="tool.id"
            class="icon-btn"
            :class="{ active: activeTool === tool.id }"
            :title="$t(tool.titleKey)"
            @click="activeTool = tool.id">
            <Icon :name="tool.icon" />
          </button>
        </div>

        <div class="separator" />

        <div class="color-size-group">
          <div class="control-item">
            <input id="colorPicker" v-model="color" type="color" class="color-picker" />
          </div>

          <div class="control-item size-control">
            <Icon name="ph:circles-three-bold" class="size-icon" />
            <input
              id="brushSize"
              v-model.number="brushSize"
              type="range"
              min="1"
              max="50"
              class="size-slider" />
            <span class="size-value">{{ brushSize }}px</span>
          </div>
        </div>
      </div>

      <div class="toolbar-section">
        <div class="history-group">
          <button
            class="icon-btn"
            :disabled="undoStack.length === 0"
            :title="$t('os.apps.paint.actions.undo')"
            @click="undo">
            <Icon name="ph:arrow-u-up-left-bold" />
          </button>
          <button
            class="icon-btn"
            :disabled="redoStack.length === 0"
            :title="$t('os.apps.paint.actions.redo')"
            @click="redo">
            <Icon name="ph:arrow-u-up-right-bold" />
          </button>
        </div>

        <div class="separator" />

        <div class="actions-group">
          <button class="action-btn" @click="clearCanvas">
            <Icon name="ph:trash-bold" />
            <span class="btn-text">{{ $t('os.apps.paint.actions.clear') }}</span>
          </button>
          <button class="action-btn primary" @click="saveImage">
            <Icon name="ph:download-simple-bold" />
            <span class="btn-text">{{ $t('os.apps.paint.actions.save') }}</span>
          </button>
        </div>
      </div>
    </div>

    <div ref="containerRef" class="canvas-container">
      <canvas
        ref="canvasRef"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';

type ToolType = 'pencil' | 'eraser' | 'line' | 'rect' | 'circle';

const availableTools = [
  {
    id: 'pencil' as ToolType,
    icon: 'ph:pencil-simple-fill',
    titleKey: 'os.apps.paint.tools.pencil'
  },
  { id: 'eraser' as ToolType, icon: 'ph:eraser-fill', titleKey: 'os.apps.paint.tools.eraser' },
  { id: 'line' as ToolType, icon: 'ph:line-segment-bold', titleKey: 'os.apps.paint.tools.line' },
  { id: 'rect' as ToolType, icon: 'ph:rectangle-bold', titleKey: 'os.apps.paint.tools.rect' },
  { id: 'circle' as ToolType, icon: 'ph:circle-bold', titleKey: 'os.apps.paint.tools.circle' }
];

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const isDrawing = ref(false);
const color = ref('#000000');
const brushSize = ref(5);
const activeTool = ref<ToolType>('pencil');

let ctx: CanvasRenderingContext2D | null = null;
let startX = 0;
let startY = 0;
let tempState: ImageData | null = null;

const undoStack = shallowRef<ImageData[]>([]);
const redoStack = shallowRef<ImageData[]>([]);
const MAX_HISTORY = 30;

const saveState = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  undoStack.value = [...undoStack.value, ctx.getImageData(0, 0, canvas.width, canvas.height)];
  if (undoStack.value.length > MAX_HISTORY) {
    undoStack.value = undoStack.value.slice(1);
  }
  redoStack.value = [];
};

const undo = () => {
  if (undoStack.value.length === 0 || !ctx || !canvasRef.value) return;
  const canvas = canvasRef.value;

  const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  redoStack.value = [...redoStack.value, current];

  const newUndoStack = [...undoStack.value];
  const lastState = newUndoStack.pop();
  undoStack.value = newUndoStack;

  if (lastState) {
    ctx.putImageData(lastState, 0, 0);
  }
};

const redo = () => {
  if (redoStack.value.length === 0 || !ctx || !canvasRef.value) return;
  const canvas = canvasRef.value;

  const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.value = [...undoStack.value, current];

  const newRedoStack = [...redoStack.value];
  const nextState = newRedoStack.pop();
  redoStack.value = newRedoStack;

  if (nextState) {
    ctx.putImageData(nextState, 0, 0);
  }
};

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
    if (tempCanvas.width > 0 && tempCanvas.height > 0) {
      ctx.drawImage(tempCanvas, 0, 0);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
};

onMounted(() => {
  setTimeout(() => {
    resizeCanvas();
  }, 50);
  window.addEventListener('resize', resizeCanvas);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});

const getCoordinates = (e: MouseEvent | TouchEvent): [number, number] => {
  const canvas = canvasRef.value;
  if (!canvas) return [0, 0];

  const rect = canvas.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  return [clientX - rect.left, clientY - rect.top];
};

const startDrawing = (e: MouseEvent | TouchEvent) => {
  if ('button' in e && e.button !== 0) return; // Only left click

  isDrawing.value = true;
  saveState();

  const coords = getCoordinates(e);
  startX = coords[0];
  startY = coords[1];

  if (canvasRef.value && ctx) {
    tempState = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);

    ctx.lineWidth = brushSize.value;
    if (activeTool.value === 'pencil' || activeTool.value === 'eraser') {
      ctx.strokeStyle = activeTool.value === 'eraser' ? '#ffffff' : color.value;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
    }
  }
};

const draw = (e: MouseEvent | TouchEvent) => {
  if (!isDrawing.value || !ctx || !canvasRef.value) return;
  const coords = getCoordinates(e);
  const currentX = coords[0];
  const currentY = coords[1];

  if (activeTool.value === 'pencil' || activeTool.value === 'eraser') {
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  } else if (tempState) {
    // Restore the state before the shape was started
    ctx.putImageData(tempState, 0, 0);

    ctx.strokeStyle = color.value;
    ctx.lineWidth = brushSize.value;
    ctx.beginPath();

    if (activeTool.value === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
    } else if (activeTool.value === 'rect') {
      ctx.rect(startX, startY, currentX - startX, currentY - startY);
    } else if (activeTool.value === 'circle') {
      const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    }

    ctx.stroke();
  }
};

const stopDrawing = () => {
  if (!isDrawing.value || !ctx) return;
  isDrawing.value = false;
  if (activeTool.value === 'pencil' || activeTool.value === 'eraser') {
    ctx.closePath();
  }
  tempState = null;
};

const clearCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  saveState();
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
  gap: 15px;
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.tools-group,
.history-group,
.actions-group,
.color-size-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.separator {
  width: 1px;
  height: 24px;
  background: var(--os-border, #444);
  opacity: 0.5;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--os-text);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--os-text) 10%, transparent);
  }

  &.active {
    background: color-mix(in srgb, #0078d4 20%, transparent);
    color: #0078d4;
    border-color: color-mix(in srgb, #0078d4 40%, transparent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.color-size-group {
  background: color-mix(in srgb, var(--os-text) 5%, transparent);
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 50%, transparent);
}

.control-item {
  display: flex;
  align-items: center;
}

.size-control {
  gap: 8px;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid color-mix(in srgb, var(--os-border, #444) 50%, transparent);
}

.size-icon {
  font-size: 16px;
  opacity: 0.7;
}

.color-picker {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  background: transparent;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid color-mix(in srgb, var(--os-text) 20%, transparent);
    border-radius: 4px;
  }
}

.size-slider {
  width: 80px;
  cursor: pointer;
  accent-color: #0078d4;
}

.size-value {
  font-size: 12px;
  min-width: 32px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: color-mix(in srgb, var(--os-text) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 50%, transparent);
  border-radius: 8px;
  color: var(--os-text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--os-text) 10%, transparent);
  }

  &.primary {
    background: #0078d4;
    color: white;
    border-color: #0078d4;

    &:hover {
      background: #006abc;
    }
  }

  .btn-text {
    display: none;
    @media (min-width: 600px) {
      display: inline;
    }
  }
}

.canvas-container {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: color-mix(in srgb, var(--os-window-bg) 50%, #000);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  canvas {
    cursor: crosshair;
    background-color: #ffffff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    touch-action: none;
    border-radius: 4px;
  }
}
</style>

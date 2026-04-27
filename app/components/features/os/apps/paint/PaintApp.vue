<template>
  <div ref="appRef" class="paint-app" tabindex="-1" @keydown="handleKeyDown">
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
          <div class="zoom-indicator" title="Zoom">{{ Math.round(zoomLevel * 100) }}%</div>
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

    <div ref="containerRef" class="canvas-container" @wheel="handleWheel" @mousedown="startPan">
      <div
        class="canvas-wrapper"
        :style="{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
          transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`
        }">
        <canvas
          ref="canvasRef"
          :width="canvasWidth"
          :height="canvasHeight"
          :style="{ width: '100%', height: '100%', cursor: cursorUrl }"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart.prevent="startDrawing"
          @touchmove.prevent="draw"
          @touchend.prevent="stopDrawing"></canvas>

        <div
          class="resize-handle top"
          @mousedown.stop.prevent="startResize($event, 'n')"
          @touchstart.stop.prevent="startResizeTouch($event, 'n')"></div>
        <div
          class="resize-handle left"
          @mousedown.stop.prevent="startResize($event, 'w')"
          @touchstart.stop.prevent="startResizeTouch($event, 'w')"></div>
        <div
          class="resize-handle top-left"
          @mousedown.stop.prevent="startResize($event, 'nw')"
          @touchstart.stop.prevent="startResizeTouch($event, 'nw')"></div>
        <div
          class="resize-handle top-right"
          @mousedown.stop.prevent="startResize($event, 'ne')"
          @touchstart.stop.prevent="startResizeTouch($event, 'ne')"></div>
        <div
          class="resize-handle bottom-left"
          @mousedown.stop.prevent="startResize($event, 'sw')"
          @touchstart.stop.prevent="startResizeTouch($event, 'sw')"></div>
        <div
          class="resize-handle right"
          @mousedown.stop.prevent="startResize($event, 'e')"
          @touchstart.stop.prevent="startResizeTouch($event, 'e')"></div>
        <div
          class="resize-handle bottom"
          @mousedown.stop.prevent="startResize($event, 's')"
          @touchstart.stop.prevent="startResizeTouch($event, 's')"></div>
        <div
          class="resize-handle bottom-right"
          @mousedown.stop.prevent="startResize($event, 'se')"
          @touchstart.stop.prevent="startResizeTouch($event, 'se')"></div>

        <div
          v-if="isResizing"
          class="resize-ghost"
          :style="{
            width: previewWidth + 'px',
            height: previewHeight + 'px',
            left: previewLeft + 'px',
            top: previewTop + 'px'
          }"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, shallowRef, nextTick, watchEffect } from 'vue';

type ToolType = 'pencil' | 'eraser' | 'line' | 'rect' | 'circle';
type HistoryState = { imgData: ImageData; width: number; height: number };
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

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

const appRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const canvasWidth = ref(800);
const canvasHeight = ref(600);
const zoomLevel = ref(1);

const isDrawing = ref(false);
const color = ref('#000000');
const brushSize = ref(5);
const activeTool = ref<ToolType>('pencil');

const cursorUrl = ref('');

watchEffect(() => {
  const size = brushSize.value * zoomLevel.value;
  const canvas = document.createElement('canvas');
  const padding = 2;
  canvas.width = size + padding * 2;
  canvas.height = size + padding * 2;
  const c = canvas.getContext('2d');
  if (c) {
    const center = size / 2 + padding;

    if (activeTool.value === 'eraser') {
      c.beginPath();
      c.arc(center, center, size / 2, 0, 2 * Math.PI);
      c.fillStyle = '#ffffff';
      c.fill();
      c.strokeStyle = '#000000';
      c.lineWidth = 1;
      c.stroke();
    } else {
      c.beginPath();
      c.arc(center, center, size / 2, 0, 2 * Math.PI);
      c.fillStyle = color.value;
      c.fill();

      c.beginPath();
      c.arc(center, center, Math.max(0.1, size / 2 - 0.5), 0, 2 * Math.PI);
      c.strokeStyle = 'rgba(255,255,255,0.8)';
      c.lineWidth = 1;
      c.stroke();

      c.beginPath();
      c.arc(center, center, size / 2 + 0.5, 0, 2 * Math.PI);
      c.strokeStyle = 'rgba(0,0,0,0.8)';
      c.lineWidth = 1;
      c.stroke();
    }
  }
  cursorUrl.value = `url(${canvas.toDataURL()}) ${size / 2 + padding} ${size / 2 + padding}, crosshair`;
});

const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
let startPanX = 0;
let startPanY = 0;
let startMouseX = 0;
let startMouseY = 0;

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey) {
    if (e.key === '+' || e.key === '=' || e.key === 'NumpadAdd') {
      e.preventDefault();
      zoomLevel.value = Math.min(5, zoomLevel.value + 0.1);
    } else if (e.key === '-' || e.key === 'NumpadSubtract') {
      e.preventDefault();
      zoomLevel.value = Math.max(0.1, zoomLevel.value - 0.1);
    } else if (e.key === '0' || e.key === 'Numpad0') {
      e.preventDefault();
      zoomLevel.value = 1;
    }
  }
};

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    const container = containerRef.value;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const relativeX = (mouseX - panX.value) / zoomLevel.value;
    const relativeY = (mouseY - panY.value) / zoomLevel.value;

    if (e.deltaY < 0) {
      zoomLevel.value = Math.min(5, zoomLevel.value + 0.1);
    } else {
      zoomLevel.value = Math.max(0.1, zoomLevel.value - 0.1);
    }

    panX.value = mouseX - relativeX * zoomLevel.value;
    panY.value = mouseY - relativeY * zoomLevel.value;
  } else {
    // Normal scroll for vertical panning if not ctrl-key
    panY.value -= e.deltaY;
    panX.value -= e.deltaX;
  }
};

const startPan = (e: MouseEvent) => {
  if (e.button !== 1) return; // Middle click
  e.preventDefault();
  isPanning.value = true;
  startPanX = panX.value;
  startPanY = panY.value;
  startMouseX = e.clientX;
  startMouseY = e.clientY;
  window.addEventListener('mousemove', doPan);
  window.addEventListener('mouseup', stopPan);
};

const doPan = (e: MouseEvent) => {
  if (!isPanning.value) return;
  panX.value = startPanX + (e.clientX - startMouseX);
  panY.value = startPanY + (e.clientY - startMouseY);
};

const stopPan = () => {
  isPanning.value = false;
  window.removeEventListener('mousemove', doPan);
  window.removeEventListener('mouseup', stopPan);
};
let ctx: CanvasRenderingContext2D | null = null;
let startX = 0;
let startY = 0;
let tempState: ImageData | null = null;

const undoStack = shallowRef<HistoryState[]>([]);
const redoStack = shallowRef<HistoryState[]>([]);
const MAX_HISTORY = 30;

const isResizing = ref(false);
const resizeDirection = ref<ResizeDirection>('se');
const previewWidth = ref(800);
const previewHeight = ref(600);
const previewLeft = ref(0);
const previewTop = ref(0);

let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;

const saveState = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  undoStack.value = [
    ...undoStack.value,
    {
      imgData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      width: canvas.width,
      height: canvas.height
    }
  ];
  if (undoStack.value.length > MAX_HISTORY) {
    undoStack.value = undoStack.value.slice(1);
  }
  redoStack.value = [];
};

const restoreState = async (state: HistoryState, isUndo: boolean) => {
  if (!canvasRef.value || !ctx) return;
  const current = {
    imgData: ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value),
    width: canvasWidth.value,
    height: canvasHeight.value
  };

  if (isUndo) {
    redoStack.value = [...redoStack.value, current];
  } else {
    undoStack.value = [...undoStack.value, current];
  }

  canvasWidth.value = state.width;
  canvasHeight.value = state.height;

  await nextTick();

  ctx = canvasRef.value.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
    ctx.putImageData(state.imgData, 0, 0);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }
};

const undo = async () => {
  if (undoStack.value.length === 0) return;
  const newUndoStack = [...undoStack.value];
  const lastState = newUndoStack.pop();
  undoStack.value = newUndoStack;
  if (lastState) {
    await restoreState(lastState, true);
  }
};

const redo = async () => {
  if (redoStack.value.length === 0) return;
  const newRedoStack = [...redoStack.value];
  const nextState = newRedoStack.pop();
  redoStack.value = newRedoStack;
  if (nextState) {
    await restoreState(nextState, false);
  }
};

onMounted(() => {
  setTimeout(() => {
    if (appRef.value) {
      appRef.value.focus();
    }
    if (containerRef.value) {
      const w = Math.max(containerRef.value.clientWidth - 40, 400);
      const h = Math.max(containerRef.value.clientHeight - 40, 300);
      canvasWidth.value = w;
      canvasHeight.value = h;

      panX.value = (containerRef.value.clientWidth - w) / 2;
      panY.value = (containerRef.value.clientHeight - h) / 2;

      nextTick(() => {
        if (canvasRef.value) {
          ctx = canvasRef.value.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
          }
        }
      });
    }
  }, 50);
});

const startResize = (e: MouseEvent, dir: ResizeDirection) => {
  if (e.button !== 0) return;
  initResize(e.clientX, e.clientY, dir);
  window.addEventListener('mousemove', onResizeMove);
  window.addEventListener('mouseup', stopResize);
};

const startResizeTouch = (e: TouchEvent, dir: ResizeDirection) => {
  initResize(e.touches[0].clientX, e.touches[0].clientY, dir);
  window.addEventListener('touchmove', onResizeMoveTouch, { passive: false });
  window.addEventListener('touchend', stopResizeTouch);
};

const initResize = (clientX: number, clientY: number, dir: ResizeDirection) => {
  isResizing.value = true;
  resizeDirection.value = dir;
  resizeStartX = clientX;
  resizeStartY = clientY;
  resizeStartWidth = canvasWidth.value;
  resizeStartHeight = canvasHeight.value;
  previewWidth.value = canvasWidth.value;
  previewHeight.value = canvasHeight.value;
  previewLeft.value = 0;
  previewTop.value = 0;
};

const onResizeMove = (e: MouseEvent) => {
  updateResizePreview(e.clientX, e.clientY);
};

const onResizeMoveTouch = (e: TouchEvent) => {
  e.preventDefault();
  updateResizePreview(e.touches[0].clientX, e.touches[0].clientY);
};

const updateResizePreview = (clientX: number, clientY: number) => {
  if (!isResizing.value) return;
  const deltaX = (clientX - resizeStartX) / zoomLevel.value;
  const deltaY = (clientY - resizeStartY) / zoomLevel.value;

  let newWidth = resizeStartWidth;
  let newHeight = resizeStartHeight;
  let newLeft = 0;
  let newTop = 0;

  if (['w', 'nw', 'sw'].includes(resizeDirection.value)) {
    newWidth = Math.max(50, resizeStartWidth - deltaX);
    newLeft = resizeStartWidth - newWidth;
  } else if (['e', 'ne', 'se'].includes(resizeDirection.value)) {
    newWidth = Math.max(50, resizeStartWidth + deltaX);
  }

  if (['n', 'nw', 'ne'].includes(resizeDirection.value)) {
    newHeight = Math.max(50, resizeStartHeight - deltaY);
    newTop = resizeStartHeight - newHeight;
  } else if (['s', 'sw', 'se'].includes(resizeDirection.value)) {
    newHeight = Math.max(50, resizeStartHeight + deltaY);
  }

  previewWidth.value = newWidth;
  previewHeight.value = newHeight;
  previewLeft.value = newLeft;
  previewTop.value = newTop;
};

const stopResize = async () => {
  window.removeEventListener('mousemove', onResizeMove);
  window.removeEventListener('mouseup', stopResize);
  await finalizeResize();
};

const stopResizeTouch = async () => {
  window.removeEventListener('touchmove', onResizeMoveTouch);
  window.removeEventListener('touchend', stopResizeTouch);
  await finalizeResize();
};

const finalizeResize = async () => {
  if (!isResizing.value) return;
  isResizing.value = false;

  if (previewWidth.value !== canvasWidth.value || previewHeight.value !== canvasHeight.value) {
    if (!canvasRef.value || !ctx) return;

    saveState();
    const imgData = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value);
    const oldWidth = canvasWidth.value;
    const oldHeight = canvasHeight.value;

    canvasWidth.value = previewWidth.value;
    canvasHeight.value = previewHeight.value;

    const offsetX = -previewLeft.value;
    const offsetY = -previewTop.value;

    await nextTick();

    ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = oldWidth;
      tempCanvas.height = oldHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.putImageData(imgData, 0, 0);
      }
      ctx.drawImage(tempCanvas, offsetX, offsetY);

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
    }
  }
};

const getCoordinates = (e: MouseEvent | TouchEvent): [number, number] => {
  const canvas = canvasRef.value;
  if (!canvas) return [0, 0];

  const rect = canvas.getBoundingClientRect();
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

  return [(clientX - rect.left) / zoomLevel.value, (clientY - rect.top) / zoomLevel.value];
};

const startDrawing = (e: MouseEvent | TouchEvent) => {
  if ('button' in e && e.button !== 0) return;

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
  background-color: color-mix(in srgb, var(--os-window-bg) 50%, #000);
  overflow: hidden;
  position: relative;
}

.canvas-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  margin: 0;
  transform-origin: top left;
  will-change: transform;

  canvas {
    display: block;
    touch-action: none;
    border-radius: 0;
  }
}

.resize-handle {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #0078d4;
  width: 8px;
  height: 8px;
  z-index: 10;
  box-sizing: border-box;

  &.top {
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  &.left {
    top: 50%;
    left: -4px;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  &.right {
    top: 50%;
    right: -4px;
    transform: translateY(-50%);
    cursor: e-resize;
  }

  &.bottom {
    left: 50%;
    bottom: -4px;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  &.top-left {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }

  &.top-right {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }

  &.bottom-left {
    bottom: -4px;
    left: -4px;
    cursor: sw-resize;
  }

  &.bottom-right {
    right: -4px;
    bottom: -4px;
    cursor: se-resize;
  }
}

.resize-ghost {
  position: absolute;
  border: 1px dashed #0078d4;
  pointer-events: none;
  z-index: 5;
  background-color: rgba(0, 120, 212, 0.05);
}
</style>

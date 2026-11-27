<script setup lang="ts">
import { getImageCrop } from "~/utils/imageCrop";

const props = defineProps<{
  file: File;
  aspectRatio: number;
  outputWidth: number;
  title: string;
  busy?: boolean;
  externalError?: string;
}>();
const emit = defineEmits<{ cancel: []; cropped: [file: File] }>();
const viewport = ref<HTMLElement | null>(null);
const viewportWidth = ref(0);
const sourceWidth = ref(0);
const sourceHeight = ref(0);
const sourceUrl = ref("");
const sourceImage = shallowRef<HTMLImageElement | null>(null);
const zoom = ref(1);
const positionX = ref(0.5);
const positionY = ref(0.5);
const loading = ref(false);
const processing = ref(false);
const error = ref("");
const crop = computed(() => sourceWidth.value && sourceHeight.value
  ? getImageCrop(sourceWidth.value, sourceHeight.value, props.aspectRatio, zoom.value, positionX.value, positionY.value)
  : null);
const imageStyle = computed(() => {
  if (!crop.value || !viewportWidth.value) return {};
  const scale = viewportWidth.value / crop.value.width;
  return {
    width: `${sourceWidth.value * scale}px`,
    height: `${sourceHeight.value * scale}px`,
    left: `${-crop.value.x * scale}px`,
    top: `${-crop.value.y * scale}px`,
  };
});
let loadVersion = 0;
let resizeObserver: ResizeObserver | undefined;
let dragStart: { pointerX: number; pointerY: number; cropX: number; cropY: number; scale: number; width: number; height: number } | null = null;

function measure() { viewportWidth.value = viewport.value?.clientWidth || 0; }

watch(() => props.file, async (file) => {
  const version = ++loadVersion;
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value);
  sourceUrl.value = URL.createObjectURL(file);
  sourceImage.value = null;
  sourceWidth.value = 0;
  sourceHeight.value = 0;
  zoom.value = 1;
  positionX.value = 0.5;
  positionY.value = 0.5;
  error.value = "";
  loading.value = true;
  try {
    const image = new Image();
    image.src = sourceUrl.value;
    await image.decode();
    if (version !== loadVersion) return;
    sourceImage.value = image;
    sourceWidth.value = image.naturalWidth;
    sourceHeight.value = image.naturalHeight;
  } catch {
    if (version === loadVersion) error.value = "This image could not be opened. Choose another file.";
  } finally {
    if (version === loadVersion) loading.value = false;
  }
}, { immediate: true });

onMounted(() => {
  measure();
  if (viewport.value && "ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport.value);
  }
  window.addEventListener("resize", measure);
});
onUnmounted(() => {
  ++loadVersion;
  resizeObserver?.disconnect();
  window.removeEventListener("resize", measure);
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value);
});

function startDrag(event: PointerEvent) {
  if (!crop.value || !viewportWidth.value || props.busy) return;
  const scale = viewportWidth.value / crop.value.width;
  dragStart = { pointerX: event.clientX, pointerY: event.clientY, cropX: crop.value.x, cropY: crop.value.y, scale, width: crop.value.width, height: crop.value.height };
  viewport.value?.setPointerCapture(event.pointerId);
}
function drag(event: PointerEvent) {
  if (!dragStart) return;
  const availableX = sourceWidth.value - dragStart.width;
  const availableY = sourceHeight.value - dragStart.height;
  if (availableX > 0) positionX.value = Math.min(1, Math.max(0, (dragStart.cropX - (event.clientX - dragStart.pointerX) / dragStart.scale) / availableX));
  if (availableY > 0) positionY.value = Math.min(1, Math.max(0, (dragStart.cropY - (event.clientY - dragStart.pointerY) / dragStart.scale) / availableY));
}
function stopDrag() { dragStart = null; }

async function finish() {
  if (!sourceImage.value || !crop.value || props.busy || processing.value) return;
  error.value = "";
  processing.value = true;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = props.outputWidth;
    canvas.height = Math.round(props.outputWidth / props.aspectRatio);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image cropping is unavailable in this browser.");
    context.drawImage(sourceImage.value, crop.value.x, crop.value.y, crop.value.width, crop.value.height, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.88));
    if (!blob) throw new Error("The cropped image could not be created.");
    const extension = blob.type === "image/webp" ? "webp" : "png";
    const name = props.file.name.replace(/\.[^.]+$/, "") || "portfolio-image";
    emit("cropped", new File([blob], `${name}-cropped.${extension}`, { type: blob.type }));
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : "The cropped image could not be created.";
  } finally {
    processing.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm overflow-y-auto p-4 sm:p-8 grid place-items-center" role="dialog" aria-modal="true" :aria-label="title">
    <div class="w-full max-w-3xl bg-off-black border border-white/20 p-5 sm:p-8 shadow-2xl">
      <div class="flex items-start justify-between gap-4 mb-5">
        <div><p class="eyebrow">Position image</p><h2 class="font-serif text-3xl mt-2">{{ title }}</h2><p class="text-sm text-muted mt-2">Drag the image to choose what appears. Zoom in if needed.</p></div>
        <button type="button" class="text-2xl text-muted hover:text-cream" aria-label="Cancel crop" :disabled="busy || processing" @click="emit('cancel')">×</button>
      </div>
      <div ref="viewport" class="relative w-full overflow-hidden bg-rich-black border border-white/15 touch-none select-none cursor-grab active:cursor-grabbing" :style="{ aspectRatio: String(aspectRatio) }" @pointerdown="startDrag" @pointermove="drag" @pointerup="stopDrag" @pointercancel="stopDrag" @lostpointercapture="stopDrag">
        <img v-if="sourceImage" :src="sourceUrl" alt="Crop preview" draggable="false" class="absolute max-w-none pointer-events-none" :style="imageStyle" />
        <p v-else class="absolute inset-0 grid place-items-center text-sm text-muted">{{ loading ? 'Opening image…' : 'Image unavailable' }}</p>
      </div>
      <label class="block text-sm text-muted mt-6">Zoom <span class="text-cream">{{ Math.round(zoom * 100) }}%</span><input v-model.number="zoom" type="range" min="1" max="3" step="0.05" class="block w-full mt-3 accent-[#d4af37]" :disabled="busy || !sourceImage" /></label>
      <p v-if="error || externalError" class="text-sm text-red-300 mt-4">{{ error || externalError }}</p>
      <div class="flex flex-wrap justify-end gap-3 mt-7"><button type="button" class="border border-white/20 px-5 py-3 text-xs uppercase tracking-widest" :disabled="busy || processing" @click="emit('cancel')">Cancel</button><button type="button" class="bg-cream text-rich-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50" :disabled="busy || processing || !sourceImage" @click="finish">{{ busy ? 'Uploading…' : processing ? 'Preparing…' : 'Use this crop' }}</button></div>
    </div>
  </div>
</template>

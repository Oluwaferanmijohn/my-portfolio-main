export type ImageCrop = { x: number; y: number; width: number; height: number };

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function getImageCrop(
  sourceWidth: number,
  sourceHeight: number,
  aspectRatio: number,
  zoom: number,
  positionX: number,
  positionY: number,
): ImageCrop {
  if (sourceWidth <= 0 || sourceHeight <= 0 || aspectRatio <= 0) {
    throw new RangeError("A valid image size and crop ratio are required");
  }
  const baseWidth = Math.min(sourceWidth, sourceHeight * aspectRatio);
  const width = baseWidth / Math.max(1, zoom);
  const height = width / aspectRatio;
  return {
    x: (sourceWidth - width) * clamp(positionX),
    y: (sourceHeight - height) * clamp(positionY),
    width,
    height,
  };
}

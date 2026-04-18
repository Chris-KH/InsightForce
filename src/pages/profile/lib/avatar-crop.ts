export type AvatarCropConfig = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Unable to load image for cropping."));
    image.src = src;
  });
}

export async function renderAvatarCropPreview(
  imageSource: string,
  config: AvatarCropConfig,
  outputSize = 320,
) {
  const image = await loadImage(imageSource);

  const naturalWidth = image.naturalWidth;
  const naturalHeight = image.naturalHeight;

  if (naturalWidth <= 0 || naturalHeight <= 0) {
    throw new Error("Invalid image dimensions.");
  }

  const zoom = clamp(config.zoom, 1, 3);
  const offsetX = clamp(config.offsetX, -1, 1);
  const offsetY = clamp(config.offsetY, -1, 1);

  const minSide = Math.min(naturalWidth, naturalHeight);
  const cropSide = minSide / zoom;

  const centerX = (naturalWidth - cropSide) / 2;
  const centerY = (naturalHeight - cropSide) / 2;

  const maxMoveX = centerX;
  const maxMoveY = centerY;

  const sourceX = clamp(
    centerX + maxMoveX * offsetX,
    0,
    naturalWidth - cropSide,
  );
  const sourceY = clamp(
    centerY + maxMoveY * offsetY,
    0,
    naturalHeight - cropSide,
  );

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to initialize image editor.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSide,
    cropSide,
    0,
    0,
    outputSize,
    outputSize,
  );

  return canvas.toDataURL("image/jpeg", 0.86);
}

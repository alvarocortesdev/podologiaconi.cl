export const isCloudinaryUrl = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/upload/");

export const buildCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url;
  const normalizedUrl = url.replace("/upload//", "/upload/");
  const {
    width,
    quality = "auto",
    format = "auto",
    crop = "fill",
    dpr = "auto",
  } = options;
  const parts = normalizedUrl.split("/upload/");
  if (parts.length < 2) return url;
  const remainder = parts[1];
  const segments = remainder.split("/");
  const firstSegment = segments[0];
  const hasTransform =
    firstSegment.includes("f_") ||
    firstSegment.includes("q_") ||
    firstSegment.includes("w_") ||
    firstSegment.includes("c_") ||
    firstSegment.includes("dpr_") ||
    firstSegment.includes("g_");
  const assetPath = hasTransform ? segments.slice(1).join("/") : remainder;
  if (!assetPath) return url;
  const params = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    `dpr_${dpr}`,
  ];
  if (width) params.push(`w_${width}`);
  return `${parts[0]}/upload/${params.join(",")}/${assetPath}`;
};

export const buildCloudinarySrcSet = (url, widths = []) => {
  if (!isCloudinaryUrl(url) || widths.length === 0) return undefined;
  return widths
    .map((width) => `${buildCloudinaryUrl(url, { width })} ${width}w`)
    .join(", ");
};

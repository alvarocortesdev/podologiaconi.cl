export const isCloudinaryUrl = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes("/upload/");

export const buildCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url;
  const {
    width,
    quality = "auto",
    format = "auto",
    crop = "fill",
    dpr = "auto",
  } = options;
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;
  if (
    parts[1].startsWith("f_") ||
    parts[1].startsWith("q_") ||
    parts[1].startsWith("w_") ||
    parts[1].startsWith("c_") ||
    parts[1].startsWith("dpr_")
  ) {
    return url;
  }
  const params = [
    `f_${format}`,
    `q_${quality}`,
    `c_${crop}`,
    `dpr_${dpr}`,
  ];
  if (width) params.push(`w_${width}`);
  return `${parts[0]}/upload/${params.join(",")}/${parts[1]}`;
};

export const buildCloudinarySrcSet = (url, widths = []) => {
  if (!isCloudinaryUrl(url) || widths.length === 0) return undefined;
  return widths
    .map((width) => `${buildCloudinaryUrl(url, { width })} ${width}w`)
    .join(", ");
};

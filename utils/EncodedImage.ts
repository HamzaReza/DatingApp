export const encodeImagePath = (url: string): string => {
  try {
    if (!url) return "";

    if (!url.includes("firebasestorage.googleapis.com")) {
      return url;
    }

    const match = url.match(/\/v0\/b\/([^/]+)\/o\/(.+?)\?(.*)/);
    if (!match) {
      return url;
    }

    const [, bucket, filePath, query] = match;

    if (filePath.includes("%")) {
      return url;
    }

    const encodedPath = encodeURIComponent(filePath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?${query}`;
  } catch (err) {
    console.error("Failed to process Firebase URL:", err);
    return url;
  }
};

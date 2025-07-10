export const encodeImagePath = (url: string): string => {
  try {
    if (!url) return "";
    const base = "https://firebasestorage.googleapis.com/v0/b/";

    // Extract bucket domain and the path after '/o/'
    const match = url.match(/\/v0\/b\/([^/]+)\/o\/(.+?)\?(.*)/);

    if (!match) throw new Error("Invalid Firebase URL format");

    const [, bucket, filePath, query] = match;

    // Encode the file path
    const encodedPath = encodeURIComponent(filePath);

    // Rebuild the fixed URL
    return `${base}${bucket}/o/${encodedPath}?${query}`;
  } catch (err) {
    console.error("Failed to fix Firebase URL:", err);
    return url; // fallback to original if it breaks
  }
};

// Utility function to check if the URL is valid
export const isValidImageUrl = async (url) => {
  try {
    const parsedUrl = new URL(url);
    const isHttp = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';

    if (!isHttp) return false;

    // Perform a HEAD request to verify the content type
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');

    // Check if the content type indicates an image
    return contentType && contentType.startsWith('image/');
  } catch (e) {
    return false;
  }
};

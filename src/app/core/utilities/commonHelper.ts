/**
 * Removes leading slashes from a string.
 */
export const removeLeadingSlashes = (str: string): string => str.replace(/^\/+/, '');

/**
 * Removes trailing slashes from a string.
 */
export const removeTrailingSlashes = (str: string): string => str.replace(/\/+$/, '');


/**
 * normalize paths
 * @param paths
 */
export const normalizePath = (...paths: (string | undefined | null)[]): string => {
  // Filter out undefined, null, and empty strings
  const normalizedSegments = paths
    .filter((segment): segment is string => !!segment && segment.trim() !== '') // Ensure non-null, non-empty strings
    .map((segment) => segment.replace(/\/+$/, '').replace(/^\/+/, '')); // Remove leading and trailing slashes

  // Join the segments and ensure it starts with a single slash and ends with a slash
  const joinedPath = normalizedSegments.join('/');
  return `/${joinedPath}/`.replace(/\/\/+/g, '/'); // Ensure no double slashes
};

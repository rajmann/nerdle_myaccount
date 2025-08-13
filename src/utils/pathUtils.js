/**
 * Utility functions for handling paths in subfolder deployments
 */

/**
 * Get the base path for the application
 * @returns {string} The base path ('/myaccount' for both dev and production)
 */
export const getBasePath = () => {
  return '/myaccount';
};

/**
 * Create a full URL path with the correct base
 * @param {string} path - The relative path
 * @returns {string} The full path with base
 */
export const createFullPath = (path) => {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (basePath === '/') {
    return `/${cleanPath}`;
  }
  
  return `${basePath}/${cleanPath}`;
};

/**
 * Get the public URL for assets
 * @returns {string} The public URL base
 */
export const getPublicUrl = () => {
  return process.env.PUBLIC_URL || getBasePath();
};
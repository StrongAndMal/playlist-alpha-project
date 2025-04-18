/**
 * Service to manage popup display logic and user preferences
 */

// Local storage keys
const POPUP_SHOWN_KEY = 'popup_last_shown';

/**
 * Determines if the feature popup should be shown based on last display time
 * Always returns true for now to ensure popup shows on every visit as requested
 */
export const shouldShowFeaturePopup = (): boolean => {
  return true;
};

/**
 * Records that the popup was shown
 */
export const markPopupAsShown = (): void => {
  localStorage.setItem(POPUP_SHOWN_KEY, new Date().toISOString());
};

/**
 * Check if the user is an admin
 * This is a placeholder for actual authentication logic
 */
export const isUserAdmin = (): boolean => {
  // For testing purposes, this always returns true
  // In production, this would check auth state
  return true;
};

/**
 * Check if the user has premium access
 * This is a placeholder for actual subscription logic
 */
export const hasUserPremium = (): boolean => {
  // Placeholder - would connect to actual subscription state
  return false;
}; 
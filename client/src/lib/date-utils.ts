/**
 * Returns the current year dynamically
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Formats a date to a localized string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('en-US', options);
}

/**
 * Returns a formatted copyright string with current year
 */
export function getCopyrightText(organizationName: string = "Excellence Institute"): string {
  return `© ${getCurrentYear()} ${organizationName}. All rights reserved.`;
}
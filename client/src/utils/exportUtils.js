/**
 * Converts an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Object} options - Export options
 * @param {Array} options.fields - Array of field names to include
 * @param {Object} options.fieldLabels - Map of field names to display labels
 * @param {Function} options.formatter - Function to format field values
 * @returns {string} CSV content
 */
export const convertToCSV = (data, options = {}) => {
  const { fields, fieldLabels = {}, formatter = (value) => value } = options;

  // Get headers
  const headers = fields.map(field => fieldLabels[field] || field);

  // Convert data to rows
  const rows = data.map(item => {
    return fields.map(field => {
      const value = item[field];
      return formatter(value, field, item);
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Downloads data as a CSV file
 * @param {string} content - CSV content
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Formats a date string to a readable format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDateForExport = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a number with commas for thousands
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumberForExport = (number) => {
  if (number === undefined || number === null) return '';
  return number.toLocaleString();
};

/**
 * Formats an array of values for CSV export
 * @param {Array} array - Array to format
 * @returns {string} Formatted array as string
 */
export const formatArrayForExport = (array) => {
  if (!array || !Array.isArray(array)) return '';
  return array.join('; ');
}; 
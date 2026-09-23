// ====================================================================
// CARPEDESAFIO — UTILITY FUNCTIONS (HASHING, EXPORTS, CONFETTI)
// ====================================================================

/**
 * Computes SHA-256 hash digest for attached evidence files to detect duplicates
 */
async function computeFileHash(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256-${hashHex}`;
  } catch (err) {
    console.warn('Crypto SHA256 fallback used:', err);
    return `sha256-mock-${file.name}-${file.size}-${Date.now()}`;
  }
}

/**
 * Exports JSON data table to downloadable UTF-8 CSV (compatible with Excel)
 */
function downloadCSV(filename, headers, rows) {
  const csvContent = [];
  csvContent.push(headers.join(';'));

  rows.forEach(row => {
    const formattedRow = row.map(val => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    });
    csvContent.push(formattedRow.join(';'));
  });

  const blob = new Blob(['\uFEFF' + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Formats ISO date string to Brazilian Portuguese format (DD/MM/YYYY)
 */
function formatDateBR(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  } catch (e) {
    return dateString;
  }
}

/**
 * Celebratory confetti launcher when action is successfully registered
 */
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6']
    });
  }
}

window.appUtils = {
  computeFileHash,
  downloadCSV,
  formatDateBR,
  triggerConfetti
};

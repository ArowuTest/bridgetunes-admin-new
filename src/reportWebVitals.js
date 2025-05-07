// ── src/reportWebVitals.js ─────────────────────────────────────────────────

/**
 * reportWebVitals — same as in a CRA + TypeScript template,
 * but explicitly JavaScript and no accidental re-exports.
 */

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(
      ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      }
    );
  }
};

export default reportWebVitals;


(function (root) {
  'use strict';
  function calculate(raw) {
    const errors = {}, values = {};
    for (const key of ['total', 'empty', 'print', 'reserve']) {
      const value = String(raw[key] ?? '').trim();
      if (key === 'reserve' && value === '') { values[key] = 0; continue; }
      if (value === '') { errors[key] = 'Enter a weight in grams.'; continue; }
      if (!/^\d+(\.\d{1,3})?$/.test(value) || Number(value) > 1000000) {
        errors[key] = 'Use 0–1,000,000 g, with up to 3 decimal places.';
      } else { values[key] = Math.round(Number(value) * 1000); }
    }
    if (!errors.total && !errors.empty && values.total < values.empty)
      errors.total = 'Total weight cannot be less than the empty spool.';
    if (Object.keys(errors).length) return { errors };
    // Integer milligrams keep decimal boundary comparisons exact.
    const available = values.total - values.empty;
    const balance = available - values.print;
    const headroom = balance - values.reserve;
    return { errors, available, balance, headroom,
      status: headroom >= 0 ? 'fits' : balance >= 0 ? 'reserve' : 'short' };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = calculate;
  else root.calculateFilament = calculate;
})(globalThis);

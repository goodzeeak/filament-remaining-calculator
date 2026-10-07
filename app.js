'use strict';
const form = document.getElementById('calculator');
const byId = id => document.getElementById(id);
const grams = value => (value / 1000).toLocaleString('en', {maximumFractionDigits: 3}) + ' g';
let isExample = true;
let announcementTimer;
function summarize(valid) {
  const prefix = isExample ? 'Example result · ' : 'Estimate · ';
  const title = prefix + byId('result-title').textContent;
  const values = valid
    ? byId('available').textContent + ' available · ' + byId('balance').textContent + ' ' + byId('balance-label').textContent.toLowerCase() + ' · ' + byId('headroom').textContent + ' ' + byId('headroom-label').textContent.toLowerCase()
    : 'Correct the highlighted fields. Results cleared.';
  byId('compact-result').dataset.status = byId('result').dataset.status;
  byId('compact-title').textContent = title;
  byId('compact-values').textContent = values;
  clearTimeout(announcementTimer);
  // One live region for both layouts; wait briefly for a pause in typing.
  announcementTimer = setTimeout(() => {
    byId('announcement').textContent = title + '. ' + values;
  }, 350);
}
function update() {
  const raw = Object.fromEntries(new FormData(form));
  const result = calculateFilament(raw);
  byId('result-context').textContent = isExample ? 'Example result' : 'Your estimate';
  byId('input-hint').textContent = isExample ? 'An editable example is loaded. Replace any weight with yours.' : 'Use your measured weights and slicer estimate.';
  for (const key of ['total', 'empty', 'print', 'reserve']) {
    byId(key + '-error').textContent = result.errors[key] || '';
    byId(key).setAttribute('aria-invalid', String(Boolean(result.errors[key])));
  }
  if (Object.keys(result.errors).length) {
    byId('result').dataset.status = 'invalid';
    byId('status-icon').textContent = '…';
    byId('result-title').textContent = 'Check your weights';
    byId('result-description').textContent = 'Correct the highlighted fields to see your result.';
    for (const id of ['available', 'balance', 'headroom']) byId(id).textContent = '—';
    byId('balance-label').textContent = 'Surplus / shortfall';
    byId('headroom-label').textContent = 'Headroom after reserve';
    byId('result-note').textContent = 'Waiting for valid weights.';
    summarize(false);
    return;
  }
  const messages = {
    fits: ['✓', 'Fits with reserve', 'Based on these weights, the print is estimated to fit while preserving your reserve.', result.headroom === 0 ? 'Exactly enough by this estimate: there is no extra headroom.' : 'Estimated reserve headroom: ' + grams(result.headroom) + '.'],
    reserve: ['!', 'Print uses your reserve', 'The estimated print requirement fits, but would leave less than your chosen reserve.', 'You need ' + grams(-result.headroom) + ' more available filament to cover the estimated print and preserve the full reserve.'],
    short: ['×', 'Not enough filament', 'Available filament is below the estimated print requirement.', 'You need ' + grams(-result.balance) + ' more available filament for the estimated print, or ' + grams(-result.headroom) + ' more including your reserve.']
  };
  byId('result').dataset.status = result.status;
  ['status-icon', 'result-title', 'result-description', 'result-note'].forEach((id, i) => byId(id).textContent = messages[result.status][i]);
  byId('available').textContent = grams(result.available);
  byId('balance-label').textContent = result.balance >= 0 ? 'Surplus after print' : 'Print shortfall';
  byId('balance').textContent = grams(Math.abs(result.balance));
  byId('headroom-label').textContent = result.headroom >= 0 ? 'Headroom after reserve' : 'Shortfall including reserve';
  byId('headroom').textContent = grams(Math.abs(result.headroom));
  summarize(true);
}
form.addEventListener('input', () => { isExample = false; update(); });
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => { isExample = true; setTimeout(update, 0); });
update();

document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });
const form = document.querySelector('#quote-form');
if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    const button = document.querySelector('#submit-quote');
    status.textContent = '';
    status.dataset.state = '';
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    button.disabled = true;
    button.textContent = 'Sending…';
    try {
      const response = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to send your request. Please try again.');
      status.dataset.state = 'success';
      status.textContent = 'Thanks! Your quote request has been sent successfully.';
      form.reset();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.message || 'Sorry, your request could not be sent.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send quote request ↗';
    }
  });
}
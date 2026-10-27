document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });
const form = document.querySelector('#quote-form');
if (form) {
  const steps = [...form.querySelectorAll('.wizard-step')];
  const progress = document.querySelector('#wizard-progress-fill');
  const count = document.querySelector('#wizard-count');
  const status = document.querySelector('#form-status');
  const done = document.querySelector('#wizard-done');
  const button = document.querySelector('#submit-quote');
  let current = 0;
  const show = n => {
    current = n;
    steps.forEach((step, index) => { step.hidden = index !== n; });
    done.hidden = true;
    progress.style.width = ((n + 1) / steps.length * 100) + '%';
    count.textContent = 'STEP 0' + (n + 1) + ' / 0' + steps.length;
    status.textContent = '';
    if (n === 2) {
      const service = form.querySelector('input[name="service"]:checked');
      document.querySelector('#wizard-summary').textContent = service ? '✳ Your project: ' + service.value : '';
    }
    const title = steps[n].querySelector('h3');
    title.setAttribute('tabindex', '-1');
    title.focus({preventScroll:true});
  };
  const validStep = () => {
    const fields = [...steps[current].querySelectorAll('input,textarea,select')].filter(field => field.type !== 'hidden');
    for (const field of fields) {
      if (!field.checkValidity()) { field.reportValidity(); field.focus(); return false; }
    }
    return true;
  };
  form.querySelectorAll('[data-next]').forEach(next => next.addEventListener('click', () => { if (validStep()) show(Math.min(current + 1,2)); }));
  form.querySelectorAll('[data-back]').forEach(back => back.addEventListener('click', () => show(Math.max(current - 1,0))));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!validStep()) return;
    status.textContent = '';
    button.disabled = true;
    button.textContent = 'Sending…';
    try {
      const payload = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/quote', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to send right now. Please try again.');
      steps.forEach(step => step.hidden = true);
      done.hidden = false;
      count.textContent = 'ALL DONE';
      progress.style.width = '100%';
      done.querySelector('h3').focus?.();
      form.reset();
    } catch (error) {
      status.textContent = error.message || 'Could not send your request. Please try again.';
    } finally {
      button.disabled = false;
      button.innerHTML = 'Send my request <span aria-hidden="true">↗</span>';
    }
  });
  document.querySelector('#wizard-reset').addEventListener('click', () => show(0));
}
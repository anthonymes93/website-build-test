const allowedServices = new Set(['Lawn care', 'Garden and planting', 'Yard cleanup', 'Other landscaping project']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max + 1) : '';
const htmlEscape = value => value.replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error:'Method not allowed.'}); }
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (body.website) return res.status(200).json({ok:true});
  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const location = clean(body.location, 120);
  const service = clean(body.service, 100);
  const message = clean(body.message, 3000);
  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 200 || phone.length > 40 || !location || location.length > 120 || !allowedServices.has(service) || message.length < 10 || message.length > 3000) {
    return res.status(400).json({error:'Please check the form fields and try again.'});
  }
  if (!process.env.RESEND_API_KEY || !process.env.QUOTE_TO_EMAIL || !process.env.QUOTE_FROM_EMAIL) {
    return res.status(503).json({error:'Quote requests are not configured yet. Please contact the business directly.'});
  }
  const details = { 'Name':name, 'Email':email, 'Phone':phone || 'Not provided', 'Project location':location, 'Service':service, 'Project details':message };
  const html = '<h2>New Rockstar Landscaping quote request</h2>' + Object.entries(details).map(([key,val]) => '<p><strong>' + htmlEscape(key) + '</strong><br>' + htmlEscape(val).replace(/\n/g,'<br>') + '</p>').join('');
  try {
    const response = await fetch('https://api.resend.com/emails', {method:'POST', headers: {Authorization:'Bearer ' + process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.QUOTE_FROM_EMAIL,to:[process.env.QUOTE_TO_EMAIL],reply_to:email,subject:'New landscaping quote request: ' + service,html})});
    if (!response.ok) {
      console.error('Resend delivery failure', response.status);
      return res.status(502).json({error:'Unable to send your request right now. Please try again later.'});
    }
    return res.status(200).json({ok:true});
  } catch (error) {
    console.error('Quote endpoint network error', error);
    return res.status(502).json({error:'Unable to send your request right now. Please try again later.'});
  }
}
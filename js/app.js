/* STARTORA — Shared JS (multi-page) */

// Navigation
function nav(url) { window.location.href = url; }

// Tabbar active state based on current URL
document.addEventListener('DOMContentLoaded', function() {
  var path = window.location.pathname;
  document.querySelectorAll('.tabbar div[data-tab]').forEach(function(tab) {
    var tabFile = tab.dataset.tab;
    var active = (
      (tabFile === 'dashboard' && path.includes('dashboard')) ||
      (tabFile === 'filing'    && (path.includes('filing') || path.includes('filing-detail'))) ||
      (tabFile === 'docs'      && path.includes('docs')) ||
      (tabFile === 'services'  && (path.includes('services') || path.includes('registrations') || path.includes('startup-docs')))
    );
    if (active) tab.classList.add('on');
  });

  // Compliance map: unlock steps if CAC complete
  if (sessionStorage.getItem('cac_complete') === '1') {
    unlockMapSteps();
  }

  // Wave pill animation
  setTimeout(triggerAskMe, 2000);
  setInterval(triggerAskMe, 9000);

  // Auth toggle
  document.querySelectorAll('.auth-toggle div[data-authview]').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.auth-toggle div').forEach(function(d) { d.classList.remove('on'); });
      opt.classList.add('on');
      document.querySelectorAll('.auth-view').forEach(function(v) { v.classList.remove('active'); });
      var t = document.getElementById('auth-' + opt.dataset.authview);
      if (t) t.classList.add('active');
    });
  });

  // Map toggle
  document.querySelectorAll('.view-toggle div[data-mapview]').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.view-toggle div').forEach(function(d) { d.classList.remove('on'); });
      opt.classList.add('on');
      document.querySelectorAll('.map-view').forEach(function(v) {
        v.classList.toggle('active', v.id === 'map-' + opt.dataset.mapview);
      });
    });
  });

  // Chip selectors
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('how-chip')) {
      document.querySelectorAll('.how-chip').forEach(function(c) { c.classList.remove('sel'); });
      e.target.classList.add('sel');
    }
    if (e.target.classList.contains('rel-chip')) {
      document.querySelectorAll('.rel-chip').forEach(function(c) { c.classList.remove('sel'); });
      e.target.classList.add('sel');
    }
  });

  // Notification tabs
  window.switchNotifTab = function(tab, view) {
    document.querySelectorAll('.notif-tab').forEach(function(t) { t.classList.remove('on'); });
    tab.classList.add('on');
    document.querySelectorAll('.notif-view').forEach(function(v) { v.classList.remove('active'); });
    var t = document.getElementById('notif-' + view);
    if (t) t.classList.add('active');
  };

  // Payment method toggle
  document.querySelectorAll('.method-opt[data-method]').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.method-opt').forEach(function(o) { o.classList.remove('sel'); });
      opt.classList.add('sel');
      var m = opt.dataset.method;
      var cf = document.getElementById('card-fields') || document.getElementById('nafdac-card-fields');
      var bf = document.getElementById('bank-fields');
      var pb = document.getElementById('pay-btn');
      if (cf) cf.style.display = m === 'card' ? 'block' : 'none';
      if (bf) bf.classList.toggle('show', m === 'transfer');
      if (pb) pb.textContent = m === 'transfer' ? 'I have made the transfer' : pb.textContent;
    });
  });
});

// Wave pill animation
function triggerAskMe() {
  document.querySelectorAll('.ai-mic-btn').forEach(function(btn) {
    btn.classList.add('pill-open');
    setTimeout(function() { btn.classList.remove('pill-open'); }, 2600);
  });
}

// Modals
function openModal(id) { var el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('open'); }
document.addEventListener('click', function(e) {
  var opener = e.target.closest('[data-open-modal]');
  if (opener) { openModal(opener.dataset.openModal); return; }
  var closer = e.target.closest('[data-close-modal]');
  if (closer) { closeModal(closer.dataset.closeModal); return; }
  if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); return; }
  var uz = e.target.closest('.upload-zone');
  if (uz) { uz.classList.toggle('done'); return; }
  var ui = e.target.closest('.upload-item');
  if (ui) { ui.classList.toggle('uploaded'); return; }
});

// Compliance map unlock (called on compliance-map.html on load)
function unlockMapSteps() {
  ['map-step2','map-step3','map-step4','map-step5'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.remove('locked'); el.classList.add('unlocked'); }
  });
  var s1 = document.getElementById('map-step1');
  if (s1) s1.classList.add('completed');
}

// Set CAC complete flag (call on payment-receipt and reg-tracking pages)
function setCACComplete() { sessionStorage.setItem('cac_complete', '1'); }

// Add shareholder
function addShareholder() {
  var name = document.getElementById('sh-new-name')?.value.trim() || 'New Shareholder';
  var pct  = document.getElementById('sh-new-pct')?.value || '0';
  var nin  = document.getElementById('sh-new-nin')?.value || '—';
  var addr = document.getElementById('sh-new-addr')?.value || '—';
  var list = document.getElementById('sh-list');
  if (!list) return;
  var initials = name.split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase();
  var card = document.createElement('div'); card.className = 'sh-card';
  var head = document.createElement('div'); head.className = 'sh-card-head';
  head.innerHTML = '<div class="sh-card-info"><div class="sh-avatar">'+initials+'</div><div><div class="sh-name">'+name+'</div><div class="sh-role">Shareholder</div></div></div><div class="sh-pct">'+pct+'%</div>';
  var detail = document.createElement('div'); detail.className = 'sh-detail'; detail.textContent = 'NIN: '+nin+' · '+addr;
  card.appendChild(head); card.appendChild(detail);
  list.insertBefore(card, list.lastElementChild);
  closeModal('sh-modal');
}

// Add witness
function addWitness() {
  var name = document.getElementById('wit-new-name')?.value.trim() || 'New Witness';
  var rel  = document.querySelector('#wit-modal .rel-chip.sel')?.textContent || 'Witness';
  var list = document.getElementById('wit-list');
  if (!list) return;
  var initials = name.split(' ').slice(0,2).map(function(w){return w[0]||'';}).join('').toUpperCase();
  var card = document.createElement('div'); card.className = 'wit-card';
  var av = document.createElement('div'); av.className = 'wit-avatar'; av.textContent = initials;
  var info = document.createElement('div'); info.style.flex = '1';
  info.innerHTML = '<div class="wit-name">'+name+'</div><div class="wit-rel">'+rel+'</div>';
  var editBtn = document.createElement('div'); editBtn.className = 'wit-edit'; editBtn.textContent = 'Edit';
  editBtn.onclick = function() { openModal('wit-modal'); };
  card.appendChild(av); card.appendChild(info); card.appendChild(editBtn);
  list.insertBefore(card, list.lastElementChild);
  closeModal('wit-modal');
}

// SCUML qualifier
function selectSCUML(card) {
  document.querySelectorAll('.qualifier-card').forEach(function(c) {
    c.classList.remove('sel'); c.querySelector('.q-check').textContent = '';
  });
  card.classList.add('sel'); card.querySelector('.q-check').textContent = '✓';
}

// NAFDAC product type
function selectPT(el) {
  document.querySelectorAll('.product-type').forEach(function(p) { p.classList.remove('sel'); });
  el.classList.add('sel');
}

// Password strength
function updatePwStrength(input) {
  var val = input.value; var score = 0;
  if (val.length >= 8) score++; if (/[0-9]/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++; if (val.length >= 12) score++;
  var bar = document.getElementById('pw-strength-bar');
  if (bar) {
    bar.style.width = (score * 25) + '%';
    bar.style.background = score <= 1 ? 'var(--stamp)' : score <= 2 ? 'var(--amber)' : 'var(--ledger)';
  }
}

// AI Chat
var AI_RESPONSES = {
  'Why do I need NAFDAC?': 'You sell packaged food. Under Nigerian law, any business manufacturing, packaging, or distributing food products must register each product with NAFDAC before it can legally be sold. Without registration, your products can be seized and you face fines up to ₦500,000.',
  'What happens if I miss annual returns?': 'Missing your CAC Annual Return filing incurs a ₦10,000 penalty per year. After 3 years of non-filing, your business can be struck off the register — ceasing to exist legally. Startora tracks this automatically and files every February.',
  'Do I qualify for SCUML?': 'Based on your business profile, Chiamaka's Kitchen likely qualifies if you handle cash transactions for goods. Food businesses that sell directly to consumers fall under Designated Non-Financial Institutions (DNFIs). Start the SCUML flow to confirm.',
  'Explain my compliance score': 'Your score of 65/100 reflects: CAC (20pts) ✓, NDPR (15pts) ✓, Annual returns tracking (10pts) ✓. Missing: Trademark (25pts) and NAFDAC is pending (10pts). Getting trademark confirmed alone pushes you to 90/100.',
};

function sendAI(chip) {
  var question = chip.textContent.trim();
  var messages = document.querySelector('.ai-messages');
  if (!messages) return;
  var userMsg = document.createElement('div'); userMsg.className = 'ai-msg user';
  userMsg.innerHTML = '<div class="ai-bubble">'+question+'</div><div class="ai-msg-time">Just now</div>';
  messages.appendChild(userMsg);
  chip.closest('.ai-suggestions')?.remove();
  setTimeout(function() {
    var aiMsg = document.createElement('div'); aiMsg.className = 'ai-msg ai';
    var response = AI_RESPONSES[question] || 'Let me check that against Nigerian regulatory requirements for your specific business type and sector.';
    aiMsg.innerHTML = '<div class="ai-bubble">'+response+'</div><div class="ai-msg-time">Now</div>';
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 800);
  messages.scrollTop = messages.scrollHeight;
}

function sendAIText() {
  var input = document.getElementById('ai-text-input');
  if (!input || !input.value.trim()) return;
  var question = input.value.trim(); var messages = document.querySelector('.ai-messages');
  if (!messages) return;
  var userMsg = document.createElement('div'); userMsg.className = 'ai-msg user';
  userMsg.innerHTML = '<div class="ai-bubble">'+question+'</div><div class="ai-msg-time">Just now</div>';
  messages.appendChild(userMsg); input.value = '';
  setTimeout(function() {
    var aiMsg = document.createElement('div'); aiMsg.className = 'ai-msg ai';
    aiMsg.innerHTML = '<div class="ai-bubble">Based on Chiamaka's Kitchen's profile — food business, Lagos, CAC registered — I'm checking this against Nigerian regulatory requirements. The compliance map has your full obligation breakdown, or ask me something more specific.</div><div class="ai-msg-time">Now</div>';
    messages.appendChild(aiMsg); messages.scrollTop = messages.scrollHeight;
  }, 800);
}

function shareProfile() {
  if (navigator.share) { navigator.share({ title: "Chiamaka's Kitchen — Startora", url: window.location.href }); }
  else { navigator.clipboard?.writeText(window.location.href); alert('Link copied!'); }
}

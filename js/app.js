/* STARTORA — Shared JS */
'use strict';

// ESSENTIAL FIX: Expose functions to window so inline onclick handlers work
window.nav = url => window.location.href = url;

window.openModal = function(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
};

window.shareProfile = function() {
  if (navigator.share) {
    navigator.share({ title: document.title, url: window.location.href });
  } else {
    navigator.clipboard?.writeText(window.location.href);
    alert('Link copied to clipboard');
  }
};

window.addShareholder = function(name, pct, nin, addr) {
  const list = document.getElementById('sh-list');
  if (!list) return;
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const card = document.createElement('div');
  card.className = 'sh-card';
  card.innerHTML = `
    <div class="sh-card-head">
      <div class="sh-card-info">
        <div class="sh-avatar">${initials}</div>
        <div><div class="sh-name">${name}</div><div class="sh-role">Shareholder</div></div>
      </div>
      <div class="sh-pct">${pct}%</div>
    </div>
    <div class="sh-detail">NIN: ${nin} · ${addr}</div>
  `;
  list.insertBefore(card, list.lastElementChild);
  window.closeModal('sh-modal');
};

window.addWitness = function(name, rel, nin) {
  const list = document.getElementById('wit-list');
  if (!list) return;
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const card = document.createElement('div');
  card.className = 'wit-card';
  card.innerHTML = `
    <div class="wit-avatar">${initials}</div>
    <div><div class="wit-name">${name}</div><div class="wit-rel">${rel}</div></div>
    <div class="wit-edit">Edit</div>
  `;
  list.insertBefore(card, list.lastElementChild);
  window.closeModal('wit-modal');
};

// Original event listeners
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) window.closeModal(e.target.id);
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('how-chip')) {
    document.querySelectorAll('.how-chip').forEach(c => c.classList.remove('sel'));
    e.target.classList.add('sel');
  }
  if (e.target.classList.contains('rel-chip')) {
    document.querySelectorAll('.rel-chip').forEach(c => c.classList.remove('sel'));
    e.target.classList.add('sel');
  }
  if (e.target.closest('.method-opt')) {
    document.querySelectorAll('.method-opt').forEach(o => o.classList.remove('sel'));
    e.target.closest('.method-opt').classList.add('sel');
    const m = e.target.closest('.method-opt').dataset.method;
    const cf = document.getElementById('card-fields');
    const bf = document.getElementById('bank-fields');
    const pb = document.getElementById('pay-btn');
    if (cf) cf.style.display = m === 'card' ? 'block' : 'none';
    if (bf) bf.classList.toggle('show', m === 'transfer');
    if (pb) pb.textContent = m === 'transfer' ? 'I have made the transfer' : 'Pay ₦300,000';
  }
  if (e.target.closest('.upload-zone')) {
    e.target.closest('.upload-zone').classList.toggle('done');
  }
  if (e.target.closest('.upload-item')) {
    e.target.closest('.upload-item').classList.toggle('uploaded');
  }
});

// Original initialization
document.querySelectorAll('.auth-toggle div[data-authview]').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.auth-toggle div').forEach(o => o.classList.remove('on'));
    opt.classList.add('on');
    document.querySelectorAll('.auth-view').forEach(v => v.classList.remove('active'));
    const t = document.getElementById('auth-' + opt.dataset.authview);
    if (t) t.classList.add('active');
  });
});

document.querySelectorAll('[data-authview-switch]').forEach(el => {
  el.addEventListener('click', () => {
    const target = el.dataset.authviewSwitch;
    document.querySelectorAll('.auth-toggle div[data-authview]').forEach(o =>
      o.classList.toggle('on', o.dataset.authview === target));
    document.querySelectorAll('.auth-view').forEach(v =>
      v.classList.toggle('active', v.id === 'auth-' + target));
  });
});

document.querySelectorAll('.view-toggle div[data-mapview]').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.view-toggle div').forEach(o => o.classList.remove('on'));
    opt.classList.add('on');
    document.querySelectorAll('.map-view').forEach(v =>
      v.classList.toggle('active', v.id === 'map-' + opt.dataset.mapview));
  });
});

document.getElementById('pay-btn')?.addEventListener('click', () => {
  document.querySelector('.pay-form')?.classList.add('hide');
  document.getElementById('pay-success')?.classList.add('show');
});

document.getElementById('send-reset-btn')?.addEventListener('click', () => {
  document.querySelector('.forgot-form')?.classList.add('hide');
  document.querySelector('.forgot-success')?.classList.add('show');
});

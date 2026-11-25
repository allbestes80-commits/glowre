/* Glowré ordering: browse freely, verify WhatsApp only when placing the order.
   Orders live in the 订货系统 (Glowré module); payment by ToyyibPay. */
(() => {
  const API = 'https://web-production-622ba.up.railway.app/api/public/glowre';
  const WA = '16404009106'; // same WhatsApp as Lumee (boss 2026-11-24)
  const PRODUCTS = [
    ['oil1', 89, 1], ['oil2', 168, 2], ['towel_stripe', 8, 0], ['towel_grey', 8, 0], ['pouch1', 5, 0], ['pouch3', 12, 0],
  ];
  const GIFT_KEYS = ['towel_stripe', 'towel_grey', 'pouch'];
  const T = {
    en: {
      bag: 'Your bag', oil1: 'Shower Oil 500 ml', oil2: 'Two Bottles 2 × 500 ml', towel_stripe: 'Striped Towel', towel_grey: 'Charcoal Towel',
      pouch1: 'Travel Pouch 20 ml', pouch3: 'Three Pouches 3 × 20 ml', pouch: 'Travel Pouch 20 ml', gift: 'Free gift', ship: 'Shipping',
      free: 'Free', total: 'Total', name: 'Recipient name', address: 'Delivery address', city: 'City', postcode: 'Postcode', state: 'State',
      optin: 'Send me Glowré offers on WhatsApp (reply STOP anytime)', pay: 'Confirm & pay', empty: 'Your bag is empty.',
      shipNote: 'Free shipping: West Malaysia RM20+, Sabah/Sarawak/Labuan RM50+',
      verify: 'Verify your WhatsApp', verifyP: 'One tap: WhatsApp opens with a message, send it and our bot replies with a 6-digit code.',
      phone: 'WhatsApp number', getCode: 'Get code on WhatsApp', code: 'Code', verifyBtn: 'Verify & continue',
      mine: 'My orders', none: 'No orders yet.', paying: 'Opening the payment page…', thanks: 'Thank you!',
      st: { pending_payment: 'Waiting for payment', paid: 'Paid · packing', shipped: 'Shipped', completed: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded' },
      tracking: 'Tracking', close: 'Close', fill: 'Please fill in every field.',
    },
    ms: {
      bag: 'Beg anda', oil1: 'Minyak Mandian 500 ml', oil2: 'Dua Botol 2 × 500 ml', towel_stripe: 'Tuala Jalur', towel_grey: 'Tuala Arang',
      pouch1: 'Pouch Perjalanan 20 ml', pouch3: 'Tiga Pouch 3 × 20 ml', pouch: 'Pouch Perjalanan 20 ml', gift: 'Hadiah percuma', ship: 'Penghantaran',
      free: 'Percuma', total: 'Jumlah', name: 'Nama penerima', address: 'Alamat penghantaran', city: 'Bandar', postcode: 'Poskod', state: 'Negeri',
      optin: 'Hantar tawaran Glowré melalui WhatsApp (balas STOP bila-bila masa)', pay: 'Sahkan & bayar', empty: 'Beg anda kosong.',
      shipNote: 'Penghantaran percuma: Semenanjung RM20+, Sabah/Sarawak/Labuan RM50+',
      verify: 'Sahkan WhatsApp anda', verifyP: 'Tekan butang, WhatsApp akan dibuka dengan mesej. Hantar, dan bot kami balas kod 6 digit.',
      phone: 'Nombor WhatsApp', getCode: 'Dapatkan kod di WhatsApp', code: 'Kod', verifyBtn: 'Sahkan & teruskan',
      mine: 'Pesanan saya', none: 'Belum ada pesanan.', paying: 'Membuka halaman pembayaran…', thanks: 'Terima kasih!',
      st: { pending_payment: 'Menunggu bayaran', paid: 'Sudah bayar · sedang dibungkus', shipped: 'Sudah dihantar', completed: 'Sudah diterima', cancelled: 'Dibatalkan', refunded: 'Dikembalikan wang' },
      tracking: 'Nombor tracking', close: 'Tutup', fill: 'Sila isi semua ruangan.',
    },
    zh: {
      bag: '购物袋', oil1: '沐浴油 500 ml', oil2: '两瓶装 2 × 500 ml', towel_stripe: '条纹毛巾', towel_grey: '炭灰毛巾',
      pouch1: '旅行装 20 ml', pouch3: '三包旅行装 3 × 20 ml', pouch: '旅行装 20 ml', gift: '赠品', ship: '运费',
      free: '包邮', total: '总共', name: '收件人', address: '收货地址', city: '城市', postcode: '邮编', state: '州属',
      optin: '我愿意在 WhatsApp 收到 Glowré 优惠（随时回复 STOP 取消）', pay: '确认并付款', empty: '购物袋是空的。',
      shipNote: '包邮：西马满 RM20，沙巴/砂拉越/纳闽满 RM50',
      verify: '验证你的 WhatsApp', verifyP: '按一下，WhatsApp 会打开一条信息，发出去，机器人马上回你 6 位验证码。',
      phone: 'WhatsApp 号码', getCode: '去 WhatsApp 拿验证码', code: '验证码', verifyBtn: '验证并继续',
      mine: '我的订单', none: '还没有订单。', paying: '正在打开付款页面…', thanks: '谢谢你！',
      st: { pending_payment: '等待付款', paid: '已付款 · 打包中', shipped: '已寄出', completed: '已收到', cancelled: '已取消', refunded: '已退款' },
      tracking: '追踪号', close: '关闭', fill: '请填好每一栏。',
    },
  };
  const STATES = ['Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'];

  const L = () => T[document.documentElement.lang] || T.en;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };
  let bag = {}; try { bag = JSON.parse(store.get('glowre-bag') || '{}'); } catch (e) {}
  let gifts = [];
  let afterVerify = null;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  async function call(path, opt = {}) {
    const token = store.get('glowre-token');
    const res = await fetch(API + path, {
      method: opt.body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: opt.body ? JSON.stringify(opt.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) store.set('glowre-token', null);
    if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong, please try again'), { status: res.status });
    return data;
  }

  /* ---------- styles + shell ---------- */
  document.head.insertAdjacentHTML('beforeend', `<style>
  .gl-dlg{margin:auto;border:0;padding:0;width:min(520px,100vw);max-height:92vh;background:var(--cream);color:var(--ink);font-family:var(--sans);font-size:14px}
  .gl-dlg::backdrop{background:rgba(21,16,11,.6)}
  .gl-in{padding:22px 20px 24px}
  .gl-in h3{font-family:var(--serif);font-size:30px;font-weight:500;margin:0 0 14px;display:flex;justify-content:space-between;align-items:center}
  .gl-x{background:none;border:0;font-size:22px;cursor:pointer;color:var(--soft)}
  .gl-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}
  .gl-row .n{flex:1}.gl-row .p{width:60px;text-align:right}
  .gl-q{display:flex;align-items:center;gap:6px}
  .gl-q button{width:30px;height:30px;border:1px solid var(--line);background:#fff;cursor:pointer;font-size:16px}
  .gl-q span{min-width:18px;text-align:center}
  .gl-f{display:block;margin-top:10px}.gl-f span{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--soft);margin-bottom:4px}
  .gl-f input,.gl-f select,.gl-f textarea{width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--line);background:#fff;font:inherit;color:var(--ink)}
  .gl-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .gl-sum{margin:14px 0 4px;display:grid;gap:4px}.gl-sum div{display:flex;justify-content:space-between}.gl-sum .t{font-weight:600;font-size:16px}
  .gl-note{font-size:12px;color:var(--soft);margin:6px 0}
  .gl-chk{display:flex;gap:8px;align-items:flex-start;margin-top:12px;font-size:13px}
  .gl-btn{display:block;width:100%;margin-top:16px;min-height:48px;background:var(--gold);border:0;color:var(--night);font:500 12px var(--sans);letter-spacing:.16em;text-transform:uppercase;cursor:pointer;text-align:center;line-height:48px;text-decoration:none}
  .gl-btn.wa{background:#25D366;color:#fff}.gl-btn[disabled]{opacity:.5;cursor:wait}
  .gl-err{color:#a0402a;font-size:13px;margin-top:10px;min-height:1em}
  .gl-ord{border:1px solid var(--line);background:#fff;padding:12px;margin-top:10px}
  .gl-ord b{font-weight:600}.gl-ord .s{float:right;font-size:12px;color:var(--soft)}
  .gl-link{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline}
  </style>`);
  const dlg = document.createElement('dialog');
  dlg.className = 'gl-dlg';
  document.body.appendChild(dlg);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  const open = (html) => { dlg.innerHTML = `<div class="gl-in">${html}</div>`; if (!dlg.open) dlg.showModal(); dlg.querySelectorAll('[data-close]').forEach((b) => (b.onclick = () => dlg.close())); };
  const head = (title) => `<h3>${title}<button class="gl-x" data-close aria-label="${L().close}">×</button></h3>`;

  /* ---------- bag ---------- */
  const saveBag = () => store.set('glowre-bag', JSON.stringify(bag));
  const giftCount = () => PRODUCTS.reduce((s, [k, , g]) => s + (bag[k] || 0) * g, 0);
  const subtotal = () => PRODUCTS.reduce((s, [k, p]) => s + (bag[k] || 0) * p, 0);
  const shipFee = (sub, pc) => { const n = Number(String(pc || '').slice(0, 5)); const east = n >= 87000 && n <= 98999; return east ? (sub >= 50 ? 0 : 15) : (sub >= 20 ? 0 : 6); };
  const addr = () => { try { return JSON.parse(store.get('glowre-addr') || '{}'); } catch (e) { return {}; } };

  function showBag(msg = '') {
    const t = L();
    const need = giftCount();
    gifts = gifts.slice(0, need);
    while (gifts.length < need) gifts.push(GIFT_KEYS[gifts.length % 3]);
    const a = addr();
    const rows = PRODUCTS.map(([k, p]) => `<div class="gl-row"><span class="n">${t[k]}</span><span class="p">RM${p}</span>
      <span class="gl-q"><button data-m="${k}" aria-label="-">−</button><span>${bag[k] || 0}</span><button data-p="${k}" aria-label="+">+</button></span></div>`).join('');
    const giftSel = gifts.map((g, i) => `<label class="gl-f"><span>🎁 ${t.gift} ${need > 1 ? i + 1 : ''}</span><select data-g="${i}">${GIFT_KEYS.map((k) => `<option value="${k}" ${k === g ? 'selected' : ''}>${t[k]}</option>`).join('')}</select></label>`).join('');
    const sub = subtotal();
    const fee = sub ? shipFee(sub, a.postcode) : 0;
    const f = (k, type = 'text', extra = '') => `<label class="gl-f"><span>${t[k]}</span><input name="${k}" type="${type}" value="${esc(a[k])}" ${extra}></label>`;
    open(`${head(t.bag)}${rows}${giftSel}
      <div class="gl-sum"><div><span>${t.ship}</span><span id="gl-fee">${fee ? 'RM' + fee : t.free}</span></div><div class="t"><span>${t.total}</span><span id="gl-tot">RM${sub + fee}</span></div></div>
      <p class="gl-note">${t.shipNote}</p>
      ${sub ? `<form id="gl-form">${f('name', 'text', 'autocomplete="name"')}<label class="gl-f"><span>${t.address}</span><textarea name="address" rows="2" autocomplete="street-address">${esc(a.address)}</textarea></label>
        <div class="gl-2">${f('postcode', 'text', 'inputmode="numeric" maxlength="5" autocomplete="postal-code"')}${f('city')}</div>
        <label class="gl-f"><span>${t.state}</span><select name="state"><option value=""></option>${STATES.map((s) => `<option ${s === a.state ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
        <label class="gl-chk"><input type="checkbox" name="optin" ${a.optin ? 'checked' : ''}><span>${t.optin}</span></label>
        <button class="gl-btn" type="submit">${t.pay}</button><div class="gl-err">${esc(msg)}</div></form>` : `<p>${t.empty}</p>`}`);
    dlg.querySelectorAll('[data-p]').forEach((b) => (b.onclick = () => { bag[b.dataset.p] = Math.min(20, (bag[b.dataset.p] || 0) + 1); saveBag(); keep(); showBag(); }));
    dlg.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { bag[b.dataset.m] = Math.max(0, (bag[b.dataset.m] || 0) - 1); if (!bag[b.dataset.m]) delete bag[b.dataset.m]; saveBag(); keep(); showBag(); }));
    dlg.querySelectorAll('[data-g]').forEach((s) => (s.onchange = () => (gifts[s.dataset.g] = s.value)));
    const form = dlg.querySelector('#gl-form');
    if (!form) return;
    form.oninput = keep;
    form.postcode.oninput = () => { keep(); const fe = shipFee(sub, form.postcode.value); dlg.querySelector('#gl-fee').textContent = fe ? 'RM' + fe : t.free; dlg.querySelector('#gl-tot').textContent = 'RM' + (sub + fe); };
    form.onsubmit = (e) => { e.preventDefault(); keep(); placeOrder(); };
  }
  function keep() {
    const form = dlg.querySelector('#gl-form');
    if (!form) return;
    store.set('glowre-addr', JSON.stringify({ name: form.name.value, address: form.address.value, postcode: form.postcode.value, city: form.city.value, state: form.state.value, optin: form.optin.checked }));
  }

  async function placeOrder() {
    const a = addr();
    if (!a.name || !a.address || !/^\d{5}$/.test(a.postcode || '') || !a.city || !a.state) return showBag(L().fill);
    if (!store.get('glowre-token')) { afterVerify = placeOrder; return showVerify(); }
    const btn = dlg.querySelector('.gl-btn');
    if (btn) { btn.disabled = true; btn.textContent = L().paying; }
    try {
      const items = PRODUCTS.filter(([k]) => bag[k]).map(([sku]) => ({ sku, qty: bag[sku] }));
      const r = await call('/orders', { body: { items, gifts, name: a.name, address: a.address, city: a.city, postcode: a.postcode, state: a.state, marketing_optin: !!a.optin } });
      bag = {}; saveBag();
      location.href = r.payment_url;
    } catch (err) {
      if (err.status === 401) { afterVerify = placeOrder; return showVerify(); }
      showBag(err.message);
    }
  }

  /* ---------- WhatsApp verification (only when ordering / viewing my orders) ---------- */
  function showVerify(msg = '') {
    const t = L();
    const lang = (document.documentElement.lang || 'en').toUpperCase();
    open(`${head(t.verify)}<p class="gl-note">${t.verifyP}</p>
      <label class="gl-f"><span>${t.phone}</span><input id="gl-ph" inputmode="tel" placeholder="0123456789" value="${esc(store.get('glowre-phone') || '')}"></label>
      <a class="gl-btn wa" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent('GLOWRE-LOGIN-' + lang)}">${t.getCode}</a>
      <label class="gl-f"><span>${t.code}</span><input id="gl-code" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="one-time-code"></label>
      <button class="gl-btn" id="gl-vbtn">${t.verifyBtn}</button><div class="gl-err">${esc(msg)}</div>`);
    dlg.querySelector('#gl-vbtn').onclick = async () => {
      const phone = dlg.querySelector('#gl-ph').value.trim();
      const code = dlg.querySelector('#gl-code').value.replace(/\D/g, '');
      store.set('glowre-phone', phone);
      try {
        const r = await call('/verify', { body: { phone, code } });
        store.set('glowre-token', r.token);
        const next = afterVerify; afterVerify = null;
        next ? next() : showMine();
      } catch (err) { showVerify(err.message); }
    };
  }

  /* ---------- my orders / one order after payment ---------- */
  const orderCard = (o) => {
    const t = L();
    return `<div class="gl-ord"><b>${o.order_no}</b><span class="s">${t.st[o.status] || o.status}</span><br>
      ${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}${o.gifts.map((g) => `<br>🎁 ${esc(g)}`).join('')}
      <br><b>RM${Number(o.total)}</b>${o.tracking_no ? `<br>${t.tracking}: ${esc(o.courier)} ${esc(o.tracking_no)}` : ''}</div>`;
  };
  async function showMine() {
    const t = L();
    if (!store.get('glowre-token')) { afterVerify = showMine; return showVerify(); }
    try {
      const me = await call('/me');
      if (me.last_address && !addr().name) store.set('glowre-addr', JSON.stringify(me.last_address));
      open(`${head(t.mine)}${me.orders.length ? me.orders.map(orderCard).join('') : `<p>${t.none}</p>`}`);
    } catch (err) { if (err.status === 401) { afterVerify = showMine; showVerify(); } }
  }
  async function showReturned(no, tok) {
    try {
      const o = await call(`/orders/${encodeURIComponent(no)}?t=${encodeURIComponent(tok)}`);
      open(`${head(o.status === 'pending_payment' ? L().st.pending_payment : L().thanks)}${orderCard(o)}
        <button class="gl-btn" id="gl-mine">${L().mine}</button>`);
      dlg.querySelector('#gl-mine').onclick = showMine;
    } catch (e) {}
    history.replaceState(null, '', location.pathname);
  }

  /* ---------- hook the page's buttons ---------- */
  const add = (sku) => { bag[sku] = (bag[sku] || 0) + 1; saveBag(); showBag(); };
  document.querySelector('.product .btn.gold')?.addEventListener('click', (e) => {
    e.preventDefault();
    const two = document.querySelector('.sizes button[aria-pressed="true"]')?.dataset.price === 'RM168';
    add(two ? 'oil2' : 'oil1');
  });
  document.querySelectorAll('#lineup a.col').forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); add(PRODUCTS[i][0]); }));
  document.querySelector('a.shop')?.addEventListener('click', (e) => { e.preventDefault(); showBag(); });
  window.glowreMyOrders = showMine;

  /* personal link from the WhatsApp bot (#gl=code): that chat already proves the number, so skip the code step */
  const gl = /[#&]gl=([\w-]+)/.exec(location.hash);
  if (gl) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (!store.get('glowre-token')) call('/link-login', { body: { code: gl[1] } }).then((r) => store.set('glowre-token', r.token)).catch(() => {});
  }

  const q = new URLSearchParams(location.search);
  if (q.get('order') && q.get('t')) showReturned(q.get('order'), q.get('t'));
})();

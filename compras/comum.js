// Abas do bot de COMPRAS (Shark Cards). Ida: #d= (deflate-raw + base64url). Volta: Telegram.WebApp.sendData.
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) { tg.ready(); tg.expand(); }
async function lerDados() {
  const h = new URLSearchParams(location.hash.slice(1)).get('d');
  if (!h) return null;
  const b64 = h.replace(/-/g, '+').replace(/_/g, '/');
  const bin = Uint8Array.from(atob(b64 + '==='.slice((b64.length + 3) % 4)), c => c.charCodeAt(0));
  const txt = await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  return JSON.parse(txt);
}
function enviar(obj) {
  const s = JSON.stringify(obj);
  if (s.length > 4000) { alert('Muita coisa de uma vez. Diminua a lista.'); return; }
  if (!tg || !tg.sendData) { alert('Abra pelo botão do bot no Telegram.'); return; }
  tg.sendData(s);
}
function el(tag, attrs = {}, ...filhos) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'onclick') n.onclick = v; else if (k in n) n[k] = v; else n.setAttribute(k, v); }
  for (const f of filhos) n.append(f);
  return n;
}
function semDados() { document.getElementById('app').innerHTML = '<p class="aviso">Abra esta aba pelo botão do bot no Telegram.</p>'; }
// lista editável de textos (palavras)
function listaEditavel(alvo, itens) {
  const box = document.getElementById(alvo); box.innerHTML = '';
  itens.forEach((t, i) => box.append(el('div', { className: 'linha' },
    el('input', { value: t, oninput: null, className: 'txt', 'data-i': i }),
    el('button', { className: 'del', onclick: () => { itens.splice(i, 1); listaEditavel(alvo, itens); } }, '✕'))));
  box.append(el('button', { className: 'add', onclick: () => { itens.push(''); listaEditavel(alvo, itens); } }, '+ Adicionar'));
  box.querySelectorAll('input.txt').forEach(inp => inp.addEventListener('input', ev => { itens[+ev.target.dataset.i] = ev.target.value; }));
}

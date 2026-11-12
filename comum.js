// comum às abas: lê os dados que o bot mandou no endereço (#d=...) e devolve as alterações com Telegram.WebApp.sendData
const tg = window.Telegram.WebApp; tg.ready(); tg.expand();
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function lerDados() {
  const h = new URLSearchParams(location.hash.slice(1)).get('d');
  if (!h) return null;
  const bin = Uint8Array.from(atob(h.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const txt = await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  return JSON.parse(txt);
}
function enviar(obj) {
  const s = JSON.stringify(obj);
  if (s.length > 4000) { alert('Muita coisa de uma vez. Tente com menos grupos.'); return; }
  tg.HapticFeedback && tg.HapticFeedback.notificationOccurred('success');
  tg.sendData(s);
}
function semDados() { document.getElementById('app').innerHTML = '<div class=vazio>Abra esta tela pelo botão do bot no Telegram.</div>'; }

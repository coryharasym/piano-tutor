// Fix the body in place: overflow:hidden alone still allows background
// scrolling in iPhone Safari. The sheet keeps its own scroll container.
export function mountSheet(backdrop, onClose = () => {}) {
  const body = document.body;
  const root = document.documentElement;
  const app = document.querySelector('#app');
  const x = window.scrollX, y = window.scrollY;
  const previousFocus = document.activeElement;
  const wasInert = app?.inert;
  const properties = ['position', 'top', 'left', 'width', 'overflow', 'padding-right'];
  const saved = properties.map((name) => [name, body.style.getPropertyValue(name), body.style.getPropertyPriority(name)]);
  const rootOverflow = root.style.overflow;
  const gutter = window.innerWidth - root.clientWidth;
  const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;

  root.style.overflow = 'hidden';
  Object.assign(body.style, { position: 'fixed', top: `${-y}px`, left: `${-x}px`, width: '100%', overflow: 'hidden' });
  if (gutter > 0) body.style.paddingRight = `${padding + gutter}px`;
  if (app) app.inert = true;
  const sheet = backdrop.querySelector('.sheet');
  sheet.setAttribute('aria-modal', 'true');
  sheet.tabIndex = -1;
  body.appendChild(backdrop);
  sheet.focus({ preventScroll: true });

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    window.removeEventListener('hashchange', close);
    backdrop.removeEventListener('keydown', onKey);
    backdrop.remove();
    onClose();
    if (app) app.inert = wasInert;
    saved.forEach(([name, value, priority]) => {
      if (value) body.style.setProperty(name, value, priority);
      else body.style.removeProperty(name);
    });
    root.style.overflow = rootOverflow;
    window.scrollTo({ left: x, top: y, behavior: 'instant' });
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  };
  const onKey = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const controls = [...sheet.querySelectorAll('button, input, select, textarea, a[href], [tabindex="0"]')]
      .filter((el) => !el.disabled && el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === sheet)) {
      event.preventDefault(); first.focus();
    }
  };
  backdrop.addEventListener('keydown', onKey);
  window.addEventListener('hashchange', close);
  return close;
}

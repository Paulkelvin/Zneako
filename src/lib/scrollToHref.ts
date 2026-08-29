export function scrollToHref(href: string) {
  if (href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

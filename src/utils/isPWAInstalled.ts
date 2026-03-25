export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches;
};
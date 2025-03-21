export function screenSaver(): void {
  let screenSaverTimeout: ReturnType<typeof setTimeout> | undefined;
  const screenSaverElement = document.getElementById('screenSaver') as HTMLElement | null;

  // No-operation standby time
  const INACTIVITY_TIME = 60000; // ms

  // Show screensaver
  function showScreenSaver(): void {
    if (screenSaverElement) {
      screenSaverElement.style.display = 'flex';
    }
  }

  // Hide screensaver
  function hideScreenSaver(): void {
    if (screenSaverElement) {
      screenSaverElement.style.display = 'none';
    }
  }

  // Detects user operation and resets timer
  function resetInactivityTimer(): void {
    hideScreenSaver();
    if (screenSaverTimeout) {
      clearTimeout(screenSaverTimeout);
    }
    screenSaverTimeout = setTimeout(showScreenSaver, INACTIVITY_TIME);
  }

  // Monitoring user operation events
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keydown', resetInactivityTimer);
  window.addEventListener('click', resetInactivityTimer);
  window.addEventListener('scroll', resetInactivityTimer);

  // Initial timer setting
  resetInactivityTimer();
}

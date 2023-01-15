const downloadButton = document.getElementById('hero-download-button');
const communityButton = document.getElementById('hero-community-button');

downloadButton.addEventListener('click', e => {
  downloadBetterDiscord();
});

communityButton.addEventListener('click', e => {
  window.location.href = "rules.html";
});

setDownloadCount();

const os = (() => {
  const { platform, userAgent } = window.navigator;

  if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].includes(platform))
    return 'Mac OS';

  if (['iPhone', 'iPad', 'iPod'].includes(platform))
    return 'iOS';

  if (['Win32', 'Win64', 'Windows', 'WinCE'].includes(platform))
    return 'Windows';

  if (/Android/.test(userAgent))
    return 'Android';

  if (/Linux/.test(platform))
    return 'Linux';

  return null;
})();

function downloadBetterDiscord() {
  const releases = "https://github.com/BetterDiscord/Installer/releases/latest/";
  switch (os) {
    case 'Windows':
      return window.location.href = releases + 'download/BetterDiscord-Windows.exe';
    case 'Mac OS':
      return window.location.href = releases + 'download/BetterDiscord-Mac.zip';
    case 'Linux':
      return window.location.href = releases + 'download/BetterDiscord-Linux.AppImage';
    default:
      // OS not found, link to downloads page
      window.location.href = releases;
  }
}

async function setDownloadCount() {
  const { count, frequency, measuredAt } = window.downloads;
  const start = new Date(measuredAt).getTime();

  const counter = new CountUp('downloads-count', count);
  counter.start();

  let duration;
  while (true) {
    await new Promise(c => setTimeout(c, duration = Math.max(1337, frequency + 2 * 1337 * Math.random() - 1337)));
    counter.update(0| count + (Date.now() - start) / frequency, { duration });
  }
}

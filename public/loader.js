// Nolea Loading Screen
function hideNoleaLoader() {
  var loader = document.getElementById('nolea-loader');
  if (!loader) return;
  loader.classList.add('hidden');
  setTimeout(function() {
    if (loader.parentNode) loader.remove();
  }, 500);
}

window.hideNoleaLoader = hideNoleaLoader;

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(hideNoleaLoader, 650);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(hideNoleaLoader, 650);
  });
}

window.addEventListener('load', function() {
  setTimeout(hideNoleaLoader, 250);
});

setTimeout(hideNoleaLoader, 2500);

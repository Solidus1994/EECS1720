function getCurrentTabUrl(callback) {
  let queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    let tab = tabs[0];
    let url = tab.url;
    console.assert(typeof url === 'string', 'tab.url should be a string');
    callback(url);
  });
}

/**
 * @param {string} color
 */
function changeBackgroundColor(color) {
  let script = 'document.body.style.backgroundColor="' + color + '";';
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * @param {string} url
 * @param {function(string)} callback
 */
function getSavedBackgroundColor(url, callback) {
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * @param {string} url
 * @param {string} color 
 */
function saveBackgroundColor(url, color) {
  let items = {};
  items[url] = color;

  chrome.storage.sync.set(items);
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    let dropdown = document.getElementById('dropdown');

    getSavedBackgroundColor(url, (savedColor) => {
      if (savedColor) {
        changeBackgroundColor(savedColor);
        dropdown.value = savedColor;
      }
    });

    dropdown.addEventListener('change', () => {
      changeBackgroundColor(dropdown.value);
      saveBackgroundColor(url, dropdown.value);
    });
  });
});

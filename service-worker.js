let contextMenuItem = {
    'id': 'saveurl',
    'title': 'Save page',
    'contexts': ['page']
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(async clickData => {
    if (clickData.menuItemId === 'saveurl') {
        let currentURL = (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url;

        let savedURLs = (await chrome.storage.sync.get('savedURLs')).savedURLs || [];

        savedURLs.push(currentURL);

        chrome.storage.sync.set({ savedURLs });
    }
});
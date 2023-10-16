(async () => {
    const activeIcon = { 'path': { '16': 'icons/16.png' } };
    const grayIcon = { 'path': { '16': 'icons/16-gray.png' } };

    let hints = (await chrome.storage.sync.get('hints')).hints || [];
    let domains = hints.map(item => item.domain);

    async function updateIcon(tabId) {
        let currentURL = new URL((await chrome.tabs.get(tabId)).url).href;
        let response = await chrome.tabs.sendMessage(tabId, { todo: 'check-login-page' }).catch(err => {
            chrome.action.setIcon(grayIcon);
            console.error(err);
            return { todo: undefined };
        });

        if (domains.includes(currentURL) || response.todo === 'go-active') {
            chrome.action.setIcon(activeIcon);
            chrome.tabs.sendMessage(tabId, { todo: 'display-on-page' });
        } else {
            chrome.action.setIcon(grayIcon);
        }

        console.log(tabId, (await chrome.tabs.get(tabId)).url, response);
    }

    chrome.tabs.onActivated.addListener(active => {
        updateIcon(active.tabId);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        updateIcon(tabId);
    });
})();
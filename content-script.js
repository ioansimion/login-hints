chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.todo === 'check-login-page') {
        if (document.querySelector('input[type="password"]')) {
            sendResponse({ todo: 'go-active' });
        } else {
            sendResponse();
        }
    }

    if (message.todo === 'display-on-page') {
        let div = document.createElement('div');
        div.classList.add('container', 'bg-light', 'fixed-top', 'z-10000', 'w-50');
        div.innerHTML = 'ELEMENT INJECTED';
        document.body.append(div);

        // const button = document.createElement('button');
        // button.classList.add('btn', 'btn-primary');
        // button.innerHTML = 'Click me';
        // div.append(button);
    }
});
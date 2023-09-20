let savedURLs = (await chrome.storage.sync.get('savedURLs')).savedURLs || [];

if (savedURLs.length) {
    document.querySelector('#saved').innerHTML = savedURLs.map(item => '<div>' + item.substring(0, 35) + '...</div>').join('');
} else {
    document.querySelector('#saved-links-row').innerHTML = `<h5 class="text-center">You haven't saved anything yet...</h5>`;
}

document.querySelector('#add-current-page-button').addEventListener('click', async () => {
    let currentURL = (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url;

    if (savedURLs.includes(currentURL)) {
        const warning = document.createElement('p');
        warning.innerHTML = 'You already saved this page. Continue?';

        const yesButton = document.createElement('button');
        yesButton.innerHTML = 'Yes';
        yesButton.classList.add('btn', 'btn-success');
        yesButton.addEventListener('click', () => {
            savedURLs.push(currentURL);

            chrome.storage.sync.set({ savedURLs });

            document.querySelector('#saved').innerHTML = savedURLs.map(item => '<div>' + item.substring(0, 35) + '...</div>').join('');

            warning.remove();
            yesButton.remove();
            noButton.remove();
        });

        const noButton = document.createElement('button');
        noButton.innerHTML = 'No';
        noButton.classList.add('btn', 'btn-danger');
        noButton.addEventListener('click', () => {
            warning.remove();
            yesButton.remove();
            noButton.remove();
        });

        document.querySelector('#confirm').append(warning, yesButton, noButton);
    } else {
        savedURLs.push(currentURL);

        chrome.storage.sync.set({ savedURLs });

        document.querySelector('#saved').innerHTML = savedURLs.map(item => '<div>' + item.substring(0, 35) + '...</div>').join('');
    }
});
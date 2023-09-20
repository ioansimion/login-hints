let savedURLs = (await chrome.storage.sync.get('savedURLs')).savedURLs || [];

// Populate with saved items
if (savedURLs.length) {
    document.querySelector('#saved-links-row').innerHTML = `
        <h2>Your saved links</h2>
        <div class="col bg-body-secondary rounded-4 overflow-hidden">
            <div class="row overflow-y-auto overflow-x-hidden" style="height: 10rem;">
                <div class="col" id="saved"></div>
            </div>
        </div>`;
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
        // Check if there is an element with saved items
        if (!document.querySelector('#saved')) {
            document.querySelector('#saved-links-row').innerHTML = `
            <h2>Your saved links</h2>
            <div class="col bg-body-secondary rounded-4 overflow-hidden">
                <div class="row overflow-y-auto overflow-x-hidden" style="height: 10rem;">
                    <div class="col" id="saved"></div>
                </div>
            </div>`;
        }

        savedURLs.push(currentURL);

        chrome.storage.sync.set({ savedURLs });

        document.querySelector('#saved').innerHTML = savedURLs.map(item => '<div>' + item.substring(0, 35) + '...</div>').join('');
    }
});
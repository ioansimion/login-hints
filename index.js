let hints = (await chrome.storage.sync.get('hints')).hints || [];
let currentURL = new URL((await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url).hostname;

function updateSaved() {
    const savedHints = document.querySelector('#saved-hints');

    if (hints.length) {
        // If there are hints, display them
        savedHints.innerHTML = `
            <h2>Your saved hints</h2>
            <div class="col bg-body-secondary rounded-4 overflow-hidden">
                <div class="row overflow-y-auto overflow-x-hidden" style="height: 10rem;">
                    <div class="col">
                        ${hints.map(item => `<div>${item.domain + ' > ' + item.hint}</div>`).join('')}
                    </div>
                </div>
            </div>`;
    } else {
        // Else display a message
        savedHints.innerHTML = `<h5 class="text-center">You haven't saved anything yet...</h5>`;
    }
}

function createHint(domain, hint) {
    hints.push({ domain, hint });
    chrome.storage.sync.set({ hints });
    updateSaved();
}

document.querySelector('#add-current-page-button').addEventListener('click', () => {
    // This function has to:
    // Check if a url is in the object list
    // If true, then display a warning message with two options
    // Option 1: Proceed with creating a new entry in the storage
    // Option 2: Cancel everything
    // If false, then: Proceed with creating a new entry in the storage
    if (hints.includes(currentURL)) {
        // Item already exists
        const warning = document.querySelector('#warning');
        const warningHTML = `
            <p class="lead">You already saved this page. Continue?</p>
            <button id="yes-button" class="btn btn-success">Yes</button>
            <button id="no-button" class="btn btn-danger">No</button>`;

        warning.innerHTML = warningHTML;
        warning.classList.add('mt-3');

        document.querySelector('#yes-button').addEventListener('click', () => {
            createHint(currentURL, hintInput.value);

            warning.innerHTML = '';
            warning.classList.remove('mt-3');
        });

        document.querySelector('#no-button').addEventListener('click', () => {
            warning.innerHTML = '';
            warning.classList.remove('mt-3');
        });

    } else {
        const hintForm = document.querySelector('#hint-form');
        const hintHTML = `
            <input id="hint-input" class="form-control" type="text" placeholder="Type your hint">
            <button id="submit-button" class="btn btn-outline-light custom-button">Submit</button>`;

        hintForm.innerHTML = hintHTML;
        hintForm.classList.add('mt-3');

        const hintInput = document.querySelector('#hint-input');
        hintInput.classList.add('mb-3');

        document.querySelector('#submit-button').addEventListener('click', () => {
            if (hintInput.value) {
                createHint(currentURL, hintInput.value);
            } else {
                // Display an error message
            }
        });
    }
});
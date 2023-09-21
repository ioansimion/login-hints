let hints = (await chrome.storage.sync.get('hints')).hints || [];
let domains;
let currentURL = new URL((await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url).hostname;
const buttonContainer = document.querySelector('#button-container');

function updateDomains() {
    domains = hints.map(item => item.domain);
}

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

function createHint(hint) {
    hints.push({ domain: currentURL, hint });
    chrome.storage.sync.set({ hints });
    updateDomains();
    updateSaved();
}

function displayForm() {
    buttonContainer.innerHTML = '';

    const form = document.querySelector('#hint-form');
    const formHTML = `
        <input id="hint-input" class="form-control" type="text" placeholder="Type your hint">
        <button id="submit-button" class="btn btn-outline-light custom-button">Submit</button>`;

    form.innerHTML = formHTML;

    const input = document.querySelector('#hint-input');
    input.classList.add('mb-3');
    input.focus();

    document.querySelector('#submit-button').addEventListener('click', () => {
        if (input.value) {
            createHint(input.value);

            form.innerHTML = '';

            updateButtonContainer();
        } else {
            // Display an error message
        }
    });
}

function displayWarning() {
    buttonContainer.innerHTML = '';

    const warning = document.querySelector('#warning');
    const warningHTML = `
        <p class="lead">You already saved this page. Continue?</p>
        <button id="yes-button" class="btn btn-success">Yes</button>
        <button id="no-button" class="btn btn-danger">No</button>`;

    warning.innerHTML = warningHTML;

    document.querySelector('#yes-button').addEventListener('click', () => {
        warning.innerHTML = '';

        displayForm();
    });

    document.querySelector('#no-button').addEventListener('click', () => {
        warning.innerHTML = '';

        updateButtonContainer();
    });
}

function updateButtonContainer() {
    buttonContainer.innerHTML = `
        <button id="add-hint-button" class="btn btn-lg btn-outline-light custom-button">
            Add this page
        </button>`;

    document.querySelector('#add-hint-button').addEventListener('click', () => {
        // This function has to:
        // Check if a url is in the object list
        // If true, then display a warning message with two options
        // Option 1: Proceed with creating a new entry in the storage
        // Option 2: Cancel everything
        // If false, then: Proceed with creating a new entry in the storage
        if (domains.includes(currentURL)) {
            displayWarning();
        } else {
            displayForm();
        }
    });
}

updateDomains();
updateButtonContainer();
updateSaved();
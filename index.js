let hints = (await chrome.storage.sync.get('hints')).hints || [];
let domains;
let currentURL = new URL((await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0].url).hostname;
const interactions = document.querySelector('#interactions');

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

function displayForm(validity = 'valid') {
    if (validity === 'valid') {
        interactions.innerHTML = `
            <input id="hint-input" class="form-control form-control-lg mb-3" type="text" placeholder="Type your hint">
            <button id="submit-button" class="btn btn-outline-light custom-button">Submit</button>
            <button id="cancel-button" class="btn btn-outline-light custom-button">Cancel</button>`;

    } else if (validity === 'invalid') {
        interactions.innerHTML = `
            <input id="hint-input" class="form-control form-control-lg is-invalid" type="text" placeholder="Type your hint">
            <div class="invalid-feedback mb-2">Please provide a hint.</div>
            <button id="submit-button" class="btn btn-outline-light custom-button">Submit</button>
            <button id="cancel-button" class="btn btn-outline-light custom-button">Cancel</button>`;
    }

    const input = document.querySelector('#hint-input');
    input.focus();

    document.querySelector('#submit-button').addEventListener('click', () => {
        if (input.value) {
            // If something is typed, create a hint and reset interactions
            createHint(input.value);

            displayAddButton();
        } else {
            // Else display an error message
            displayForm('invalid');
        }
    });

    document.querySelector('#cancel-button').addEventListener('click', displayAddButton);
}

function displayWarning() {
    interactions.innerHTML = `
        <p class="lead">You already saved this page. Continue?</p>
        <button id="yes-button" class="btn btn-outline-light custom-button">Yes</button>
        <button id="no-button" class="btn btn-outline-light custom-button">No</button>`;

    document.querySelector('#yes-button').addEventListener('click', () => {
        displayForm();
    });

    document.querySelector('#no-button').addEventListener('click', displayAddButton);
}

function displayAddButton() {
    interactions.innerHTML = `
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
displayAddButton();
updateSaved();
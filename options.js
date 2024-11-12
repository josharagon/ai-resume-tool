/* options.js */
document.addEventListener('DOMContentLoaded', () => {
    // Load stored settings
    chrome.storage.local.get(['apiKey', 'userData'], (result) => {
        if (result.apiKey) {
            document.getElementById('apiKey').value = result.apiKey;
        }
        if (result.userData) {
            document.getElementById('userData').value = result.userData;
        }
    });

    // Save settings
    document.getElementById('saveButton').addEventListener('click', () => {
        const apiKey = document.getElementById('apiKey').value;
        const userData = document.getElementById('userData').value;

        chrome.storage.local.set({ apiKey, userData }, () => {
            alert('Settings saved.');
        });
    });
});

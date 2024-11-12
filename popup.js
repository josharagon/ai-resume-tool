// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // Load stored API key and resume data when the popup opens
    chrome.storage.local.get(['apiKey', 'userData'], (result) => {
        if (result.apiKey) {
            document.getElementById('apiKeyInput').value = result.apiKey;
        }
        if (result.userData) {
            document.getElementById('userData').value = result.userData;
        }
    });

    // Save the API Key
    document.getElementById('saveApiKeyButton').addEventListener('click', () => {
        const apiKey = document.getElementById('apiKeyInput').value;
        if (apiKey) {
            chrome.storage.local.set({ apiKey: apiKey }, () => {
                alert('API Key saved securely.');
            });
        } else {
            alert('Please enter a valid API Key.');
        }
    });

    // Save resume data from the textarea
    document.getElementById('saveResumeDataButton').addEventListener('click', () => {
        const userData = document.getElementById('userData').value;
        if (userData) {
            chrome.storage.local.set({ userData: userData }, () => {
                alert('Resume data saved.');
            });
        } else {
            alert('Please enter your resume data.');
        }
    });
});

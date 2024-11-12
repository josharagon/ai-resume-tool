document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('resumeInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const resumeText = e.target.result;
            const parsedData = parseResume(resumeText);
            // Store parsed data in chrome storage
            chrome.storage.local.set({ userData: parsedData }, () => {
                alert('Resume data saved successfully!');
            });
        };
        reader.readAsText(file);
    } else {
        alert('Please select a resume file.');
    }
});

// Simple resume parsing function
function parseResume(text) {
    const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/g;
    const phoneRegex = /(\+?\d{1,3})?[\s-]?\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

    const emailMatches = text.match(emailRegex);
    const phoneMatches = text.match(phoneRegex);

    return {
        email: emailMatches ? emailMatches[0] : '',
        phone: phoneMatches ? phoneMatches[0] : '',
        resumeText: text
    };
}



document.getElementById('saveApiKeyButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    if (apiKey) {
        // Store the API key securely
        chrome.storage.local.set({ apiKey: apiKey }, () => {
            alert('API Key saved securely.');
        });
    } else {
        alert('Please enter a valid API Key.');
    }
});

// Load stored API key and resume data when the popup opens
document.addEventListener('DOMContentLoaded', () => {
    // Load API key
    chrome.storage.local.get(['apiKey'], (result) => {
        if (result.apiKey) {
            document.getElementById('apiKeyInput').value = result.apiKey;
        }
    });

    // Load existing resume data
    chrome.storage.local.get(['userData'], (result) => {
        if (result.userData) {
            document.getElementById('userData').value = result.userData;
        }
    });
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

// After parsing the resume, populate the textarea
document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('resumeInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const resumeText = e.target.result;
            document.getElementById('userData').value = resumeText;
            alert('Resume loaded into textarea. Review and click "Save Resume Data" when ready.');
        };
        reader.readAsText(file);
    } else {
        alert('Please select a resume file.');
    }
});

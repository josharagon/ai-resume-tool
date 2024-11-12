// contentScript.js

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'generateAnswer') {
        const question = message.question;
        console.log('Received generateAnswer message with question:', question);

        // Send a message to the background script to generate the answer
        chrome.runtime.sendMessage({ action: 'generateAnswer', question: question });
    } else if (message.action === 'insertAnswer') {
        const answer = message.answer;

        // Insert the answer into the active input or textarea
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            activeElement.value += answer;
        } else {
            // Copy to clipboard if no suitable element is focused
            navigator.clipboard.writeText(answer).then(() => {
                alert('Generated answer copied to clipboard.');
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }
    } else if (message.action === 'missingCredentials') {
        alert('Please set up your API Key and Resume Data in the extension options.');
        chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    } else if (message.action === 'error') {
        alert(message.message);
    }
});

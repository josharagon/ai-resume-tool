// background.js - Background Script

// Create the context menu item
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'generateAnswer',
        title: 'Answer this question',
        contexts: ['selection']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'generateAnswer') {
        // Send a message to the content script to generate an answer
        chrome.tabs.sendMessage(tab.id, {
            action: 'generateAnswer',
            question: info.selectionText
        });
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'generateAnswer') {
        const question = message.question;

        try {
            // Retrieve userData and apiKey from storage using Promises
            const result = await chrome.storage.local.get(['userData', 'apiKey']);
            const userData = result.userData;
            const apiKey = result.apiKey;

            if (!userData || !apiKey) {
                // Notify the content script to prompt the user
                chrome.tabs.sendMessage(sender.tab.id, { action: 'missingCredentials' });
                return;
            }

            const answer = await generateAnswer(question, userData, apiKey);

            if (answer) {
                // Send the generated answer back to the content script
                chrome.tabs.sendMessage(sender.tab.id, { action: 'insertAnswer', answer: answer });
            } else {
                chrome.tabs.sendMessage(sender.tab.id, { action: 'error', message: 'Could not generate an answer.' });
            }
        } catch (error) {
            console.error('Error generating answer:', error);
            chrome.tabs.sendMessage(sender.tab.id, { action: 'error', message: 'An error occurred while generating the answer.' });
        }
    } else if (message.action === 'openOptionsPage') {
        chrome.runtime.openOptionsPage();
    }
}); // Added missing closing parenthesis and brace

// Function to generate AI-powered answers
async function generateAnswer(question, userData, apiKey) {
    console.log('Generating answer for question:', question);
    const prompt = `Based on the following resume data, answer the question in first person:\n\nResume Data:\n${userData}\n\nQuestion:\n${question}\n\nAnswer:`;

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log('OpenAI API response:', data);

        if (response.ok) {
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].text.trim();
            } else {
                console.error('No choices available in the response');
                return '';
            }
        } else {
            console.error('Error from OpenAI API:', data.error);
            return '';
        }
    } catch (error) {
        console.error('Error generating answer:', error);
        return '';
    }
}

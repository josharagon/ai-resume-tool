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
        chrome.tabs.sendMessage(tab.id, {
            action: 'generateAnswer',
            question: info.selectionText
        });
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openOptionsPage') {
        chrome.runtime.openOptionsPage();
    }
});

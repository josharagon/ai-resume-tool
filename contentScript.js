(function () {
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
            if (data && data.choices && data.choices.length > 0) {
                return data.choices[0].text.trim();
            } else {
                console.error('No choices available in the response');
                console.error('Error details:', data);
                return '';
            }
        } catch (error) {
            console.error('Error generating answer:', error);
            return '';
        }
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'generateAnswer') {
            const question = message.question;
            console.log('Received generateAnswer message with question:', question);

            // Retrieve userData and apiKey from storage
            chrome.storage.local.get(['userData', 'apiKey'], async (result) => {
                const userData = result.userData;
                const apiKey = result.apiKey;

                if (!userData || !apiKey) {
                    // Prompt the user to set up their API key and data
                    alert('Please set up your API Key and Resume Data in the extension options.');
                    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
                    return;
                }

                const answer = await generateAnswer(question, userData, apiKey);

                if (answer) {
                    // Option 1: Insert into the active input or textarea
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                        activeElement.value += answer;
                    } else {
                        // Option 2: Copy to clipboard
                        navigator.clipboard.writeText(answer).then(() => {
                            alert('Generated answer copied to clipboard.');
                        }, (err) => {
                            console.error('Could not copy text: ', err);
                        });
                    }
                } else {
                    alert('Could not generate an answer.');
                }
            });
        }
    });
})();

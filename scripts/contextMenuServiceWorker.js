const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        });
    });
};

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;
        let url = tabs[0].url;
        console.log(url);
        let site;
        if (url.includes("mail.google")) {
            site = "gmail";
        }
        else if(url.includes("outlook"))
        {
            site="outlook";
        }

        chrome.tabs.sendMessage(
            activeTab,
            { message: site, content },
            (response) => {
                if (response.status === 'failed') {
                    console.log('injection failed.');
                }
            }
        );
        //console.log(tabs[0].url);
    });
};

const generate = async (prompt) => {
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 256,
            temperature: 0.7,
        }),
    });

    const completion = await completionResponse.json();
    return completion.choices.pop();
}
const generateCompletionAction = async (info) => {
    try {
        sendMessage('generating...');
        const { selectionText } = info;
        const basePromptPrefix = `Without including the subject line, write me an email template based off the subject line of "`;

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}"\n`);
        let text = baseCompletion.text;
        sendMessage(text.substring(1));
    } catch (error) {
        console.log(error);
        sendMessage(error.toString());
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Generate email',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
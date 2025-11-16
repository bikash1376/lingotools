document.addEventListener('DOMContentLoaded', () => {
    const checkHealthBtn = document.getElementById('check-health-btn');
    const statusMessage = document.getElementById('status-message');
    const translateBtn = document.getElementById('translate-btn');
    const localeSelect = document.getElementById('locale');
    const resultContainer = document.getElementById('result');
    const API_BASE_URL = 'http://localhost:3000'; //only for local development

    checkHealthBtn.addEventListener('click', async () => {
        checkHealthBtn.disabled = true;
        statusMessage.textContent = 'Checking...';
        statusMessage.className = '';

        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
            const data = await response.json();

            statusMessage.textContent = 'OK: ' + (data.message || JSON.stringify(data));
            statusMessage.className = 'success';
        } catch (error) {
            console.error('Health check failed:', error);
            statusMessage.textContent = 'Error: ' + error.message;
            statusMessage.className = 'error';
        } finally {
            checkHealthBtn.disabled = false;
        }
    });

    translateBtn.addEventListener('click', async () => {
        translateBtn.disabled = true;
        statusMessage.textContent = 'Capturing page...';
        statusMessage.className = '';

        try {
            // getting active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.id) throw new Error('No active tab found');

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.documentElement.outerHTML,
            });

            const pageHtml = results?.[0]?.result;
            if (!pageHtml) throw new Error('Could not retrieve page HTML');

            statusMessage.textContent = 'Translating...';

            const resp = await fetch(`${API_BASE_URL}/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html: pageHtml, targetLocale: localeSelect.value || 'es' })
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`Translate API error: ${resp.status} ${txt}`);
            }

            const data = await resp.json();
            resultContainer.innerHTML = data.translatedHtml || '<em>(no translated content)</em>';
            statusMessage.textContent = 'Applying translated HTML to the page...';
            statusMessage.className = 'success';

            // inject html
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (translated) => {
                        document.open();
                        document.write(translated);
                        document.close();
                    },
                    args: [data.translatedHtml]
                });
                statusMessage.textContent = 'Done';
                statusMessage.className = 'success';
            } catch (injectErr) {
                console.error('Injection failed', injectErr);
                statusMessage.textContent = 'Injection error: ' + injectErr.message;
                statusMessage.className = 'error';
            }

        } catch (err) {
            console.error('Translation failed', err);
            statusMessage.textContent = 'Error: ' + err.message;
            statusMessage.className = 'error';
            resultContainer.innerHTML = '';
        } finally {
            translateBtn.disabled = false;
        }
    });
});
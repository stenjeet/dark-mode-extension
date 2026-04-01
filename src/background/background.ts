chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	if (request.type === "GET_DOMAIN") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const url = tabs[0]?.url;
			const hostname = url ? new URL(url).hostname : null;
			sendResponse({ hostname });
		});
		return true;
	}
});
const siteStyles: Record<string, string> = {
	"youtube.com": "sitesTheme/youtube.css",
	"twitch.tv": "sitesTheme/twitch.css",
};

const GLOBAL_STYLE_FILE = "css/global-dark.css";
const STYLE_DATA_ATTR = "data-dark-theme-style";
const STYLE_FILE_ATTR = "data-dark-theme-file";
const EXCLUDED_SITES_KEY = "excludedSites";
const EXTENSION_STATUS = "extensionStatus";


function getHostname(): string {
	return window.location.hostname.replace(/^www\./, "");
}

function resolveSiteStyleFile(hostname: string) {
	for (const [domain, file] of Object.entries(siteStyles)) {
		if (hostname === domain || hostname.endsWith(`.${domain}`)) {
			return file;
		}
	}

	return GLOBAL_STYLE_FILE;
}

function loadCSS(file: string) {
	const exits = document.querySelector(
		`link[${STYLE_DATA_ATTR}="true"][${STYLE_FILE_ATTR}="${file}"]`
	);
	if (exits) return;

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = chrome.runtime.getURL(file);
	link.setAttribute(STYLE_DATA_ATTR, "true");
	link.setAttribute(STYLE_FILE_ATTR, file);
	document.head.appendChild(link);
}

function removeCSS() {
	document
		.querySelectorAll(`link[${STYLE_DATA_ATTR}="true"]`)
		.forEach((link) => link.remove());
}

function applyDarkMode(enabled: boolean) {
	removeCSS();
	if (!enabled) return;

	loadCSS(resolveSiteStyleFile(getHostname()));
}

function applySavedMode() {
	const hostname = getHostname();
	chrome.storage.local.get([EXCLUDED_SITES_KEY, EXTENSION_STATUS], (result) => {
		const extensionStatus = result[EXTENSION_STATUS] as "On" | "Off" | undefined;
		if (extensionStatus === "Off") {
			applyDarkMode(false);
			return;
		}

		const excludedSites = (result[EXCLUDED_SITES_KEY] || {}) as Record<string, boolean>;
		const isExcluded = Boolean(excludedSites[hostname]);
		applyDarkMode(!isExcluded);
	});
}

chrome.runtime.onMessage.addListener((msg) => {
	if (msg?.action === "changeMode") {
		applySavedMode();
	}

	if (msg?.action === "changeGlobalMode") {
		applySavedMode();
	}
});

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName !== "local") return;
	if (changes[EXCLUDED_SITES_KEY] || changes[EXTENSION_STATUS]) {
		applySavedMode();
	}
});

applySavedMode();

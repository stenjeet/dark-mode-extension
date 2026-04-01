import { Segmented } from "antd";
import { useEffect, useState } from "react";
import styles from './SiteToggle.module.scss';


type ModeValue = "Dark" | "Regular";
const EXCLUDED_SITES_KEY = "excludedSites";

const SiteToggle = () => {
  const [mode, setMode] = useState<ModeValue>("Dark");
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [hostname, setHostname] = useState<string | null>(null);

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
			const tab = tabs[0];
			if (tab?.id === undefined || !tab.url) return;

			const tabHostname = new URL(tab.url).hostname.replace(/^www\./, "");
      setActiveTabId(tab.id);
      setHostname(tabHostname);

			chrome.storage.local.get(EXCLUDED_SITES_KEY, (result) => {
				const excludedSites = (result[EXCLUDED_SITES_KEY] || {}) as Record<string, boolean>;
				const isExcluded = Boolean(excludedSites[tabHostname]);

				setMode(isExcluded ? "Regular" : "Dark");
			});
		});
  	}, []);


  const handleModeChange = (value: string | number) => {
    const nextMode = value === "Dark" ? "Dark" : "Regular";
    setMode(nextMode);

    if (activeTabId === null || !hostname) return;

    chrome.storage.local.get(EXCLUDED_SITES_KEY, (result) => {
      const excludedSites = (result[EXCLUDED_SITES_KEY] || {}) as Record<string, boolean>;
      if (nextMode === "Regular") {
        excludedSites[hostname] = true;
      } else {
        delete excludedSites[hostname];
      }

      chrome.storage.local.set({ [EXCLUDED_SITES_KEY]: excludedSites });

      chrome.tabs.sendMessage(activeTabId, {
        action: "changeMode",
        enabled: nextMode === "Dark",
      });
    });
  };

  return (
    <Segmented
		className={styles.siteToggle}
		size="small"
      	options={["Dark", "Regular"]}
      	value={mode}
      	onChange={handleModeChange}
      	disabled={activeTabId === null || !hostname}
    />
  );
};

export default SiteToggle;

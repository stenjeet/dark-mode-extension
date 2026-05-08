import { useEffect, useState } from "react";
import SiteItem from "../SiteItem/SiteItem";
import styles from "./SiteList.module.scss";
import { Plus } from "lucide-react";

const EXCLUDED_SITES_KEY = "excludedSites";

function SiteList() {
  const [sites, setSites] = useState<string[]>([]);
  const [newSite, setNewSite] = useState<string>("");

  useEffect(() => {
    const loadSites = () => {
      chrome.storage.local.get(EXCLUDED_SITES_KEY, (result) => {
        const excludedSites = (result[EXCLUDED_SITES_KEY] || {}) as Record<
          string,
          boolean
        >;
        const excludedDomains = Object.keys(excludedSites).filter(
          (domain) => excludedSites[domain],
        );
        setSites(excludedDomains);
      });
    };

    const handleStorageChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string,
    ) => {
      if (areaName !== "local") return;
      if (!changes[EXCLUDED_SITES_KEY]) return;
      loadSites();
    };

    loadSites();
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  function removeSite(site: string) {
    setSites((prev) => {
      const nextSites = prev.filter((p) => p !== site);

      const nextExludedSites = Object.fromEntries(
        nextSites.map((domain) => [domain, true]),
      );

      chrome.storage.local.set({ [EXCLUDED_SITES_KEY]: nextExludedSites });

      return nextSites;
    });
  }

  function addExcludedSite() {
    setSites((prev) => {
      const site = newSite.trim().toLowerCase();
      if (!site || prev.includes(site)) return prev;

      const nextSites = [...prev, site];
      const nextExludedSites = Object.fromEntries(
        nextSites.map((domain) => [domain, true]),
      );

      chrome.storage.local.set({ [EXCLUDED_SITES_KEY]: nextExludedSites });

      return nextSites;
    });

    setNewSite("");
  }

  return (
    <div className={styles.siteListWrapper}>
      <div className={styles.addSite}>
        <h3 className={styles.addSiteTitle}>Sites excluded</h3>
        <div className={styles.addSiteControls}>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => setNewSite(e.target.value)}
            value={newSite}
            placeholder="example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addExcludedSite();
              }
            }}
          />
          <button className={styles.button} onClick={addExcludedSite}>
            <Plus />
          </button>
        </div>
      </div>
      <div className={styles.siteList}>
        {sites.length === 0 ? (
          <p className={styles.emptyState}>Нет сайтов в списке</p>
        ) : (
          sites.map((site) => (
            <SiteItem key={site} site={site} remove={removeSite} />
          ))
        )}
      </div>
    </div>
  );
}

export default SiteList;

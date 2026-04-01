import { useEffect, useState } from 'react';
import SiteItem from '../SiteItem/SiteItem';
import styles from './SiteList.module.scss';


const EXCLUDED_SITES_KEY = "excludedSites";

function SiteList() {
	const [sites, setSites] = useState<string[]>([]); 

	useEffect(() => {
		const loadSites = () => {
			chrome.storage.local.get(EXCLUDED_SITES_KEY, (result) => {
				const excludedSites = (result[EXCLUDED_SITES_KEY] || {}) as Record<string, boolean>;
				const excludedDomains = Object.keys(excludedSites).filter((domain) => excludedSites[domain]);
				setSites(excludedDomains);
			});
		};

		const handleStorageChange = (
			changes: Record<string, chrome.storage.StorageChange>,
			areaName: string
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
	}, [])

	function removeSite(site: string) {
		setSites((prev) => {
			const nextSites = prev.filter(p => p !== site);

			const nextExludedSites = Object.fromEntries(nextSites.map(domain => [domain, true]));

			chrome.storage.local.set({ [EXCLUDED_SITES_KEY]: nextExludedSites });

			return nextSites;
		})
	}


	return ( 
		<div className={styles.siteList}>

			{sites.map(site => 
				<SiteItem 
					key={site}
					site={site}
					remove={removeSite}
				/>
			)}
		</div>
	 );
}

export default SiteList;

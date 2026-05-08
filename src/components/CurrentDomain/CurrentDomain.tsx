import { useEffect, useState } from "react";
import styles from './CurrentDomain.module.scss';


function CurrentDomain() {
	const [domain, setDomain] = useState<string | null>(null);

	useEffect(() => {
		chrome.runtime.sendMessage({ type: "GET_DOMAIN"}, (response) => {
			const hostname = response?.hostname ?? null;
			setDomain(hostname);
		});
	}, []);

	return (  
		<div>
			<p className={styles.domain}>{domain}</p>
		</div>
	);
}

export default CurrentDomain;

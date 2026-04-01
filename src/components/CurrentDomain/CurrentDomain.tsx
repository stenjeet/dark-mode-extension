import { useEffect, useState } from "react";


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
			{domain}
		</div>
	);
}

export default CurrentDomain;

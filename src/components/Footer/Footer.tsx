import { useEffect, useState } from 'react';
import styles from './Footer.module.scss';

type ModeValue = 'On' | 'Off';

const EXTENSION_STATUS = 'extensionStatus';
const EXTENSION_STATUS_LOCAL_STORAGE_KEY = 'extensionStatus';

function Footer() {
	const [extensionEnabled, setExtensionEnabled] = useState(true);

	useEffect(() => {
		const applyMode = (mode: ModeValue) => {
			setExtensionEnabled(mode === 'On');
		};

		const loadStatus = () => {
			chrome.storage.local.get(EXTENSION_STATUS, (result) => {
				const storageMode = result[EXTENSION_STATUS] as ModeValue | undefined;
				if (storageMode === 'On' || storageMode === 'Off') {
					applyMode(storageMode);
					return;
				}

				const localMode = localStorage.getItem(EXTENSION_STATUS_LOCAL_STORAGE_KEY);
				if (localMode === 'On' || localMode === 'Off') {
					applyMode(localMode);
				}
			});
		};

		const handleStorageChange = (
			changes: Record<string, chrome.storage.StorageChange>,
			areaName: string
		) => {
			if (areaName !== 'local') return;
			if (!changes[EXTENSION_STATUS]) return;

			const nextValue = changes[EXTENSION_STATUS].newValue as ModeValue | undefined;
			if (nextValue === 'On' || nextValue === 'Off') {
				applyMode(nextValue);
			}
		};

		loadStatus();
		chrome.storage.onChanged.addListener(handleStorageChange);

		return () => {
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	return (
		<footer className={styles.footer}>
			<p className={styles.message}>
				{extensionEnabled ? (
					<span className={styles.enabled}>✓ Extension active</span>
				) : (
					<span className={styles.disabled}>✗ Extension disabled</span>
				)}
			</p>
		</footer>
	);
}

export default Footer;

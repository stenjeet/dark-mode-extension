import { ConfigProvider, Switch } from "antd";
import { useEffect, useState } from "react";
import styles from "./GlobalToggle.module.scss";


type ModeValue = "On" | "Off";
const EXTENSION_STATUS = "extensionStatus";
const EXTENSION_STATUS_LOCAL_STORAGE_KEY = "extensionStatus";

function GlobalToggle() {
	const [mode, setMode] = useState<ModeValue>("On");

	useEffect(() => {
		chrome.storage.local.get(EXTENSION_STATUS, (result) => {
			const savedStatus = result[EXTENSION_STATUS] as ModeValue | undefined;
			if (savedStatus === "On" || savedStatus === "Off") {
				setMode(savedStatus);
				return;
			}

			const fallbackStatus = localStorage.getItem(EXTENSION_STATUS_LOCAL_STORAGE_KEY);
			if (fallbackStatus === "On" || fallbackStatus === "Off") {
				setMode(fallbackStatus);
			}
		});
	}, []);

	const handleChange = (checked: boolean) => {
		const nextMode: ModeValue = checked ? "On" : "Off";
		setMode(nextMode);

		chrome.storage.local.set({ [EXTENSION_STATUS]: nextMode });
		localStorage.setItem(EXTENSION_STATUS_LOCAL_STORAGE_KEY, nextMode);

		chrome.tabs.query({}, (tabs) => {
			tabs.forEach((tab) => {
				if (tab.id === undefined) return;
				chrome.tabs.sendMessage(tab.id, { action: "changeGlobalMode", mode: nextMode });
			});
		});
	};

	return (
			<ConfigProvider
				theme={{
					token: {


					}
				}}
			>
				<Switch
					className={styles.globalToggle}
					checkedChildren="On"
					unCheckedChildren="Off"
					checked={mode === "On"}
					onChange={handleChange}
			/>
			</ConfigProvider>
	);
}

export default GlobalToggle;

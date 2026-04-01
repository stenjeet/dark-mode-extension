import { CloseOutlined } from "@ant-design/icons";
import styles from './SiteItem.module.scss';

interface SiteItemProps {
	site: string;
	remove: (site: string) => void;
}

function SiteItem({ site, remove }: SiteItemProps) {
	return (  
		<div className={styles.siteItem}>
			<div className={styles.site}>
				<p>{site}</p>
			</div>
			<CloseOutlined
				className={styles.removeSite}
				onClick={() => remove(site)}
			/>
		</div>
	);
}

export default SiteItem;

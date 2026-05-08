import styles from './SiteItem.module.scss';
import { Trash2 } from "lucide-react";

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
			<button
				onClick={() => remove(site)}
				className={styles.removeButton}
			>
				<Trash2 className={styles.removeIcon} />
			</button>
		</div>
	);
}

export default SiteItem;

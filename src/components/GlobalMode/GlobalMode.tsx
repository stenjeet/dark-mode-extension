import { Globe } from 'lucide-react';
import GlobalToggle from '../GlobalToggle/GlobalToggle';
import styles from './GlobalMode.module.scss';

function GlobalMode() {
	return (
		<section className={styles.card}>
			<article className={styles.info}>
				<Globe className={styles.icon} />
				<p className={styles.title}>Extension</p>
				<p className={styles.subtitle}>Global Mode</p>
			</article>
			<GlobalToggle />
		</section>
	);
}

export default GlobalMode;

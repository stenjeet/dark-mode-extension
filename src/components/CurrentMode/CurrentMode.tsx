import CurrentDomain from '../CurrentDomain/CurrentDomain';
import SiteToggle from '../SiteToggle/SiteToggle';
import styles from './CurrentMode.module.scss';

function CurrentMode() {
	return (  
			<section className={styles.card}>
				<article className={styles.info}>
					<p className={styles.title}>Сurrent site</p>
					<CurrentDomain/>
				</article>
				<SiteToggle/>
		</section>
	);
}

export default CurrentMode;
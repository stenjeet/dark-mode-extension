import styles from './Header.module.scss';
import { Moon } from 'lucide-react';

function Header() {
	return (
		<div className={styles.header}>
			<div className={styles.icon}>
				<Moon className={styles.moonIcon} />
			</div>
			<div className={styles.headerTitle}>
				<h1 className={styles.title}>Dark Mode</h1>
				<p className={styles.subtitle}>Managing dark theme</p>
			</div>
		</div>
	);
}

export default Header;

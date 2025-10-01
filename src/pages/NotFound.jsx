import { NavLink } from 'react-router';
import styles from './NotFound.module.css';

export default function NotFound() {
    return (
        <div>
            <h1>Not Found</h1>
            <nav className={styles.nav}>
                <NavLink to={'/'} >
                    Back Home
                </NavLink>
            </nav>
        </div>
    )
}
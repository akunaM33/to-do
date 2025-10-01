import { NavLink} from 'react-router';
import styles from './Header.module.css';

export default function Header({title}){

    return(
        <main className = {styles.header}>
        
        <nav >
            <NavLink to='/' className = {({isActive}) => isActive ? styles.active : ""}>
             Home </NavLink>
            <NavLink to='/about' className = {({isActive}) => isActive ? styles.active : ""}>
             About </NavLink>
        </nav>

        <h1>{title}</h1>
        </main>
    );
}
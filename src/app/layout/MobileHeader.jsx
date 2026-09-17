import { Link } from 'react-router'
import Avatar from '../../components/Avatar.jsx'
import Logo from '../../components/Logo.jsx'
import styles from './MobileHeader.module.css'

// Encabezado del celular: la marca y, a la derecha, tu inicial para abrir el perfil
export default function MobileHeader({ user }) {
  return (
    <header className={styles.header}>
      <Logo size={32} />
      <Link to="/perfil" className={styles.profileLink} aria-label="Tu perfil">
        <Avatar name={user.name} size={42} />
      </Link>
    </header>
  )
}

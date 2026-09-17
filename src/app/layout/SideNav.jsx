import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { NavLink } from 'react-router'
import Avatar from '../../components/Avatar.jsx'
import Button from '../../components/Button.jsx'
import Logo from '../../components/Logo.jsx'
import { NAV_ITEMS } from './navigation.js'
import styles from './SideNav.module.css'

// Barra lateral del computador
export default function SideNav({ user, onQuickAdd }) {
  return (
    <aside className={styles.sidebar}>
      <Logo />

      <Button icon={Plus} size="lg" fullWidth onClick={onQuickAdd}>
        Registrar
      </Button>

      <nav aria-label="Principal">
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={styles.link}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="side-nav-active"
                        className={styles.activeBackground}
                        transition={{ type: 'spring', stiffness: 520, damping: 40 }}
                      />
                    )}
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <NavLink to="/perfil" className={styles.profile}>
        <Avatar name={user.name} size={44} />
        <span className={styles.profileText}>
          <span className={styles.profileName}>{user.name}</span>
          <span className={styles.profileHint}>Perfil y preferencias</span>
        </span>
      </NavLink>
    </aside>
  )
}

import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { NavLink } from 'react-router'
import { NAV_ITEMS } from './navigation.js'
import styles from './BottomNav.module.css'

// Barra de pestañas del celular con el botón "+" en el centro
export default function BottomNav({ onQuickAdd }) {
  const middle = Math.ceil(NAV_ITEMS.length / 2)

  return (
    <nav className={styles.bar} aria-label="Principal">
      <ul className={styles.list} style={{ '--columns': NAV_ITEMS.length + 1 }}>
        {NAV_ITEMS.slice(0, middle).map((item) => (
          <NavItem key={item.to} item={item} />
        ))}

        <li className={styles.addItem}>
          <button
            type="button"
            className={styles.addButton}
            onClick={onQuickAdd}
            aria-label="Registrar actividad"
          >
            <Plus size={30} strokeWidth={2.75} aria-hidden="true" />
          </button>
        </li>

        {NAV_ITEMS.slice(middle).map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
      </ul>
    </nav>
  )
}

function NavItem({ item: { to, label, icon: Icon, end } }) {
  return (
    <li>
      {/* NavLink marca la pestaña activa con aria-current="page" */}
      <NavLink to={to} end={end} className={styles.link}>
        {({ isActive }) => (
          <>
            {/* layoutId: la "píldora" activa se desliza de una pestaña a otra */}
            {isActive && (
              <motion.span
                layoutId="bottom-nav-active"
                className={styles.activeBackground}
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            )}
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  )
}

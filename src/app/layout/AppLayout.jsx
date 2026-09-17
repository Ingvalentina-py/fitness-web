import { motion } from 'motion/react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useCurrentUser } from '../../features/auth/useAuth.js'
import BottomNav from './BottomNav.jsx'
import MobileHeader from './MobileHeader.jsx'
import QuickAddSheet from './QuickAddSheet.jsx'
import SideNav from './SideNav.jsx'
import styles from './AppLayout.module.css'

// Estructura de las pantallas con sesión:
// - Celular: encabezado arriba + barra de pestañas abajo con el "+" en el centro.
// - Computador (≥ 768 px): barra lateral a la izquierda.
export default function AppLayout() {
  const { data: user } = useCurrentUser()
  const { pathname } = useLocation()
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

  const openQuickAdd = () => setIsQuickAddOpen(true)

  return (
    <div className={styles.shell}>
      <SideNav user={user} onQuickAdd={openQuickAdd} />

      <div className={styles.main}>
        <MobileHeader user={user} />

        {/* key = ruta: al cambiar de pestaña el contenido se vuelve a montar y entra con un fundido rápido */}
        <motion.main
          key={pathname}
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet context={{ openQuickAdd }} />
        </motion.main>
      </div>

      <BottomNav onQuickAdd={openQuickAdd} />
      <QuickAddSheet open={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </div>
  )
}

import styles from './BarList.module.css'

// Lista de barras horizontales para comparar categorías con nombres largos.
// Cada fila lleva su nombre y su valor escritos: el color acompaña, nunca es
// lo único que distingue una categoría de otra.
// items: [{ key, name, value, display, color }]
export default function BarList({ items, emptyMessage = 'Todavía no hay datos.' }) {
  if (items.length === 0) return <p className={styles.empty}>{emptyMessage}</p>

  const top = Math.max(...items.map((item) => item.value))

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.key} className={styles.row}>
          <span className={styles.head}>
            <span className={styles.name}>
              {item.color && (
                <span className={styles.dot} style={{ '--tone': item.color }} aria-hidden="true" />
              )}
              {item.name}
            </span>
            <span className={`${styles.value} num`}>{item.display ?? item.value}</span>
          </span>
          <span className={styles.track}>
            <span
              className={styles.bar}
              style={{
                width: `${top === 0 ? 0 : Math.max(2, (item.value / top) * 100)}%`,
                '--tone': item.color ?? 'var(--primary-strong)',
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  )
}

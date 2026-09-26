import styles from './ChartTable.module.css'

// Los mismos datos de la gráfica en una tabla. Va oculta a la vista pero disponible
// para lectores de pantalla, y se puede desplegar con "Ver los datos": una gráfica
// nunca debe ser la única forma de llegar a un número.
export default function ChartTable({ caption, columns, rows }) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Ver los datos</summary>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, position) =>
                  position === 0 ? (
                    <th key={position} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={position} className="num">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

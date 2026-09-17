import styles from './SegmentedControl.module.css'

// Elegir una opción entre pocas (ej. kg / lb) con botones grandes y fáciles de tocar.
// Por dentro son radio buttons: funcionan con teclado y con FormData.
export default function SegmentedControl({ legend, name, options, defaultValue }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.segments}>
        {options.map((option) => (
          <label key={option.value} className={styles.segment}>
            <input
              className={styles.input}
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

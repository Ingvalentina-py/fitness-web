import styles from './ChoiceChips.module.css'

// Opciones como "pastillas" que se pueden tocar y que bajan a otra línea si no caben.
// type="radio": elige una (value es un valor). type="checkbox": elige varias (value es una lista).
// Por dentro son inputs reales: funcionan con teclado y lectores de pantalla.
export default function ChoiceChips({
  legend,
  hideLegend = false,
  name,
  options,
  type = 'radio',
  value,
  onChange,
  disabledValues = [],
}) {
  const isChecked = (optionValue) =>
    type === 'radio' ? value === optionValue : value.includes(optionValue)

  function handleChange(optionValue, checked) {
    if (type === 'radio') return onChange(optionValue)
    onChange(checked ? [...value, optionValue] : value.filter((item) => item !== optionValue))
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={hideLegend ? 'visually-hidden' : styles.legend}>{legend}</legend>
      <div className={styles.chips}>
        {options.map((option) => (
          <label key={option.value} className={styles.chip}>
            <input
              className={styles.input}
              type={type}
              name={name}
              value={option.value}
              checked={isChecked(option.value)}
              disabled={disabledValues.includes(option.value)}
              onChange={(event) => handleChange(option.value, event.target.checked)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

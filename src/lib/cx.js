// Une nombres de clases CSS ignorando los vacíos:
// cx('button', isActive && 'active') → 'button active' o 'button'
export function cx(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

import { Save } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import Field from '../../components/Field.jsx'
import Sheet from '../../components/Sheet.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useCreatePhrase, useUpdatePhrase } from './usePhrases.js'
import styles from './PhraseFormSheet.module.css'

// Cuándo se muestra cada frase, en palabras de la persona
const CONTEXT_HINTS = {
  general: 'Rotando en la pantalla Hoy.',
  streak: 'Cuando llevas días seguidos moviéndote.',
  record: 'Cuando superas una marca tuya.',
  sessionCompleted: 'Al terminar una sesión de gimnasio.',
}

export default function PhraseFormSheet({ phrase, onClose }) {
  const { meta } = useMetaLabels()
  const [text, setText] = useState(phrase?.text ?? '')
  const [context, setContext] = useState(phrase?.context ?? 'general')

  const createPhrase = useCreatePhrase()
  const updatePhrase = useUpdatePhrase()
  const save = phrase ? updatePhrase : createPhrase
  const fieldErrors = getFieldErrors(save.error)

  function handleSubmit(event) {
    event.preventDefault()
    const values = { text, context }
    save.mutate(phrase ? { id: phrase._id, ...values } : values, { onSuccess: onClose })
  }

  return (
    <Sheet open onClose={onClose} title={phrase ? 'Editar frase' : 'Nueva frase'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {save.isError && !fieldErrors.text && <Alert>{save.error.message}</Alert>}

        <Field
          as="textarea"
          label="Tu frase"
          rows={2}
          maxLength={140}
          placeholder="Ej.: Hoy por la de mañana."
          value={text}
          onChange={(event) => setText(event.target.value)}
          hint={`${text.length}/140`}
          required
          error={fieldErrors.text}
        />

        {meta && (
          <>
            <ChoiceChips
              legend="¿Cuándo quieres leerla?"
              name="context"
              options={meta.phraseContexts}
              value={context}
              onChange={setContext}
            />
            <p className={styles.hint}>{CONTEXT_HINTS[context]}</p>
          </>
        )}

        <Button type="submit" icon={Save} disabled={save.isPending || text.trim() === ''}>
          {save.isPending ? 'Guardando…' : phrase ? 'Guardar frase' : 'Crear frase'}
        </Button>
      </form>
    </Sheet>
  )
}

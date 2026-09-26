import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import BackLink from '../../components/BackLink.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import Switch from '../../components/Switch.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import PhraseFormSheet from './PhraseFormSheet.jsx'
import { useDeletePhrase, usePhrases, useUpdatePhrase } from './usePhrases.js'
import styles from './PhrasesPage.module.css'

// /perfil/frases — tus frases motivacionales y las que trae la app
export default function PhrasesPage() {
  const mine = usePhrases({ scope: 'mine', includeInactive: true })
  const system = usePhrases({})
  const updatePhrase = useUpdatePhrase()
  const deletePhrase = useDeletePhrase()
  const { meta } = useMetaLabels()

  // null = cerrado; {} = nueva; { phrase } = editar
  const [formSheet, setFormSheet] = useState(null)
  const [phraseToDelete, setPhraseToDelete] = useState(null)

  const contextLabel = (value) =>
    meta?.phraseContexts.find((context) => context.value === value)?.label ?? value
  const systemPhrases = (system.data ?? []).filter((phrase) => !phrase.owner)

  return (
    <Stagger>
      <Reveal>
        <BackLink to="/perfil">Perfil</BackLink>
        <PageHeader
          title="Mis frases"
          subtitle="Lo que quieres leerte a ti misma mientras entrenas."
        />
      </Reveal>

      <Reveal>
        <Button icon={Plus} onClick={() => setFormSheet({})}>
          Nueva frase
        </Button>
      </Reveal>

      {mine.isError && (
        <Reveal>
          <Alert>No pudimos cargar tus frases. Recarga la página.</Alert>
        </Reveal>
      )}

      <Reveal>
        <GlassCard aria-labelledby="my-phrases-title">
          <h2 id="my-phrases-title" className={styles.sectionTitle}>
            Tus frases
          </h2>

          {mine.isPending && <p className={styles.message}>Cargando tus frases…</p>}

          {mine.isSuccess && mine.data.length === 0 && (
            <p className={styles.message}>
              Todavía no has escrito ninguna. Las tuyas aparecen mezcladas con las de la app
              en la pantalla Hoy.
            </p>
          )}

          <ul className={styles.list}>
            {(mine.data ?? []).map((phrase) => (
              <li key={phrase._id} className={styles.phrase}>
                <div className={styles.text}>
                  <p className={styles.quote}>“{phrase.text}”</p>
                  <p className={styles.context}>{contextLabel(phrase.context)}</p>
                  {/* Desactivar en vez de borrar: deja de salir pero no se pierde */}
                  <Switch
                    label="Activa"
                    checked={phrase.isActive}
                    onChange={(event) =>
                      updatePhrase.mutate({ id: phrase._id, isActive: event.target.checked })
                    }
                  />
                </div>
                <div className={styles.actions}>
                  <IconButton
                    icon={Pencil}
                    label={`Editar "${phrase.text}"`}
                    onClick={() => setFormSheet({ phrase })}
                  />
                  <IconButton
                    icon={Trash2}
                    label={`Borrar "${phrase.text}"`}
                    onClick={() => setPhraseToDelete(phrase)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="system-phrases-title">
          <h2 id="system-phrases-title" className={styles.sectionTitle}>
            Las de la app
          </h2>
          <p className={styles.message}>
            Vienen con la app y son iguales para todo el mundo. Si quieres otras, escribe las tuyas.
          </p>
          <ul className={styles.systemList}>
            {systemPhrases.map((phrase) => (
              <li key={phrase._id} className={styles.systemPhrase}>
                <span className={styles.quote}>“{phrase.text}”</span>
                <span className={styles.context}>{contextLabel(phrase.context)}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      {formSheet && (
        <PhraseFormSheet phrase={formSheet.phrase} onClose={() => setFormSheet(null)} />
      )}

      {phraseToDelete && (
        <ConfirmSheet
          title="¿Borrar esta frase?"
          description={`Se borra “${phraseToDelete.text}”. Si solo quieres dejar de verla, desactívala.`}
          confirmLabel="Borrar frase"
          danger
          isPending={deletePhrase.isPending}
          onClose={() => setPhraseToDelete(null)}
          onConfirm={() =>
            deletePhrase.mutate(phraseToDelete._id, { onSuccess: () => setPhraseToDelete(null) })
          }
        />
      )}
    </Stagger>
  )
}

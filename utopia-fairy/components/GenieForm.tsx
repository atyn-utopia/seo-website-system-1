'use client'

import { useState, useRef, useEffect } from 'react'
import FileUpload from './FileUpload'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function GenieForm() {
  const [prompt, setPrompt] = useState('')
  const [slug, setSlug] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<FormState>('idle')
  const [projectPath, setProjectPath] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const formatSlug = (value: string) => {
    return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || !slug.trim()) return
    setState('submitting')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('prompt', prompt)
    formData.append('slug', formatSlug(slug))
    files.forEach((file) => formData.append('files', file))

    try {
      const res = await fetch('/api/create-project', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setState('success')
        setProjectPath(data.projectPath)
      } else {
        setState('error')
        setErrorMsg(data.error || 'Something went wrong')
      }
    } catch {
      setState('error')
      setErrorMsg('Failed to connect to server')
    }
  }

  const reset = () => {
    setPrompt('')
    setSlug('')
    setFiles([])
    setState('idle')
    setProjectPath('')
    setErrorMsg('')
  }

  const isDisabled = state === 'submitting' || state === 'success'
  const canSubmit = prompt.trim() && slug.trim() && state !== 'submitting'

  return (
    <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <textarea
        ref={textareaRef}
        className="fairy-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="I want to create a website for renting wheelchairs in Malaysia. The brand is WheelCare, domain wheelcare.my. Target cities: KL, PJ, Shah Alam..."
        rows={4}
        style={{ minHeight: 120, resize: 'none' }}
        disabled={isDisabled}
      />

      <input
        type="text"
        className="fairy-input"
        value={slug}
        onChange={(e) => setSlug(formatSlug(e.target.value))}
        placeholder="Project name (slug), e.g. wheelchair-malaysia"
        style={{ padding: '10px 16px', fontSize: 14, borderRadius: 10 }}
        disabled={isDisabled}
      />

      <FileUpload files={files} onFilesChange={setFiles} />

      {state === 'success' ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          <div className="success-text">
            ✦ Wish granted! Project created at <code className="success-code">{projectPath}</code>
          </div>
          <button
            onClick={reset}
            style={{
              background: 'transparent',
              border: '1px solid var(--input-border)',
              borderRadius: 12,
              padding: '10px 24px',
              color: 'var(--text-muted)',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'border-color 0.3s, color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent-fairy)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--input-border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            ✧ Make another wish
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <button
            className="fairy-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {state === 'submitting' ? '✦ Casting spell...' : '✦ Grant My Wish'}
          </button>
          {state === 'error' && (
            <div style={{ color: '#ef9a9a', fontSize: 13, textAlign: 'center' }}>{errorMsg}</div>
          )}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { documentsService, isMockMode } from '@gestao-rh/shared'
import '@gestao-rh/shared/styles/theme.css'

const emptyForm = {
  title: '',
  employeeName: '',
  department: '',
  status: 'pending',
  pendingSignatures: 0,
  description: '',
}

const statusOptions = [
  { value: 'pending', label: 'Aguardando assinatura' },
  { value: 'partially_signed', label: 'Parcialmente assinado' },
  { value: 'completed', label: 'Concluido' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'draft', label: 'Rascunho' },
]

function DocumentsListPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadDocuments() {
    setLoading(true)
    setError('')

    documentsService
      .getAll()
      .then(setDocuments)
      .catch(() => setError('Nao foi possivel carregar os documentos pelo BFF.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  return (
    <section className="remote-stack">
      <article className="remote-hero">
        <div>
          <p className="eyebrow">Remote independente</p>
          <h2>Documentos e assinaturas</h2>
          <p>
            Esta feature ja opera no fluxo front para BFF e BFF para microservico 1, sem acessar
            diretamente o MongoDB ou o microservico.
          </p>
        </div>
        <div className="hero-actions">
          <span className={`status-pill small${isMockMode ? ' warn' : ''}`}>
            {isMockMode ? 'Mock local' : 'BFF real'}
          </span>
          <Link to="new" className="primary-action">
            Novo documento
          </Link>
        </div>
      </article>

      <article className="remote-card">
        <div className="remote-card-header">
          <div>
            <p className="eyebrow">Funcionalidade 1</p>
            <h3>Listagem de documentos</h3>
          </div>
          <div className="header-actions">
            <span>{documents.length} documentos</span>
            <button type="button" className="secondary-action" onClick={loadDocuments}>
              Atualizar
            </button>
          </div>
        </div>

        {error ? <div className="feedback-card error">{error}</div> : null}

        {loading ? <div className="feedback-card">Carregando documentos...</div> : null}

        {!loading && documents.length === 0 ? (
          <div className="feedback-card">
            Nenhum documento retornado pelo BFF. Crie um documento para validar o fluxo com o
            microservico Mongo.
          </div>
        ) : null}

        {!loading && documents.length > 0 ? (
          <div className="remote-list">
            {documents.map((document) => (
              <Link key={document.id} to={String(document.id)} className="remote-list-item">
                <div>
                  <strong>{document.title}</strong>
                  <span>
                    {document.employeeName} - {document.department}
                  </span>
                </div>
                <div className="list-meta">
                  <span className={`status-pill small ${document.pendingSignatures > 0 ? ' warn' : ''}`}>
                    {document.statusLabel}
                  </span>
                  <small>Atualizado em {document.updatedAt}</small>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  )
}

function DocumentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')

    documentsService
      .getById(id)
      .then((response) => {
        if (!response) {
          setError('Documento nao encontrado.')
          return
        }

        setDocument(response)
      })
      .catch(() => setError('Nao foi possivel consultar o documento no BFF.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    const shouldDelete = window.confirm('Deseja realmente excluir este documento?')

    if (!shouldDelete) {
      return
    }

    setDeleting(true)

    try {
      await documentsService.remove(id)
      navigate('..', { relative: 'path' })
    } catch {
      setError('Falha ao excluir o documento pelo BFF.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="remote-card">Carregando documento...</div>
  }

  if (error && !document) {
    return (
      <section className="remote-stack">
        <Link to=".." relative="path" className="inline-link">
          Voltar para documentos
        </Link>
        <div className="feedback-card error">{error}</div>
      </section>
    )
  }

  return (
    <section className="remote-stack">
      <div className="page-actions">
        <Link to=".." relative="path" className="inline-link">
          Voltar para documentos
        </Link>
        <div className="header-actions">
          <Link to="edit" relative="path" className="secondary-action link-action">
            Editar
          </Link>
          <button type="button" className="danger-action" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      {error ? <div className="feedback-card error">{error}</div> : null}

      <article className="remote-card">
        <p className="eyebrow">Funcionalidade 2</p>
        <h2>{document.title}</h2>
        <p>{document.description}</p>

        <div className="details-grid">
          <div>
            <span>Funcionario</span>
            <strong>{document.employeeName}</strong>
          </div>
          <div>
            <span>Setor</span>
            <strong>{document.department}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{document.statusLabel}</strong>
          </div>
          <div>
            <span>Assinaturas pendentes</span>
            <strong>{document.pendingSignatures}</strong>
          </div>
          <div>
            <span>Ultima atualizacao</span>
            <strong>{document.updatedAt}</strong>
          </div>
          <div>
            <span>Identificador</span>
            <strong>{document.id}</strong>
          </div>
        </div>
      </article>
    </section>
  )
}

function DocumentFormPage({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = mode === 'edit'
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) {
      return
    }

    setLoading(true)
    setError('')

    documentsService
      .getById(id)
      .then((document) => {
        if (!document) {
          setError('Documento nao encontrado para edicao.')
          return
        }

        setForm({
          title: document.title ?? '',
          employeeName: document.employeeName ?? '',
          department: document.department ?? '',
          status: document.status ?? 'pending',
          pendingSignatures: document.pendingSignatures ?? 0,
          description: document.description ?? '',
        })
      })
      .catch(() => setError('Nao foi possivel carregar o documento para edicao.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function updateField(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const savedDocument = isEditing
        ? await documentsService.update(id, form)
        : await documentsService.create(form)

      navigate(isEditing ? '..' : `../${savedDocument.id}`, { relative: 'path' })
    } catch {
      setError(
        isEditing
          ? 'Nao foi possivel atualizar o documento pelo BFF.'
          : 'Nao foi possivel criar o documento pelo BFF.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="remote-stack">
      <div className="page-actions">
        <Link to={isEditing ? '..' : '..'} relative="path" className="inline-link">
          Voltar
        </Link>
        <span className={`status-pill small${isMockMode ? ' warn' : ''}`}>
          {isMockMode ? 'Mock local' : 'BFF real'}
        </span>
      </div>

      <article className="remote-card">
        <p className="eyebrow">{isEditing ? 'Atualizacao via BFF' : 'Criacao via BFF'}</p>
        <h2>{isEditing ? 'Editar documento' : 'Novo documento'}</h2>
        <p>Os dados enviados por esta tela passam pelo BFF antes de chegar ao microservico de documentos.</p>

        {error ? <div className="feedback-card error">{error}</div> : null}
        {loading ? <div className="feedback-card">Carregando formulario...</div> : null}

        {!loading ? (
          <form className="document-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Titulo</span>
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Ex: Contrato de experiencia"
                required
              />
            </label>

            <div className="form-grid">
              <label className="field-group">
                <span>Funcionario</span>
                <input
                  value={form.employeeName}
                  onChange={(event) => updateField('employeeName', event.target.value)}
                  placeholder="Nome do colaborador"
                  required
                />
              </label>

              <label className="field-group">
                <span>Setor</span>
                <input
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  placeholder="Ex: People Ops"
                  required
                />
              </label>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>Status</span>
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                <span>Assinaturas pendentes</span>
                <input
                  type="number"
                  min="0"
                  value={form.pendingSignatures}
                  onChange={(event) => updateField('pendingSignatures', event.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field-group">
              <span>Descricao</span>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Descreva o objetivo do documento"
                required
              />
            </label>

            <div className="page-actions">
              <Link to={isEditing ? '..' : '..'} relative="path" className="secondary-action link-action">
                Cancelar
              </Link>
              <button type="submit" className="primary-action" disabled={saving}>
                {saving ? 'Salvando...' : isEditing ? 'Salvar alteracoes' : 'Criar documento'}
              </button>
            </div>
          </form>
        ) : null}
      </article>
    </section>
  )
}

export default function DocumentsApp() {
  return (
    <Routes>
      <Route index element={<DocumentsListPage />} />
      <Route path="new" element={<DocumentFormPage mode="create" />} />
      <Route path=":id" element={<DocumentDetailsPage />} />
      <Route path=":id/edit" element={<DocumentFormPage mode="edit" />} />
    </Routes>
  )
}

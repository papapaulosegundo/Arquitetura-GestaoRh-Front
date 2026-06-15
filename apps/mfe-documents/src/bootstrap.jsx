import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { documentsService } from '@gestao-rh/shared'
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
  const navigate = useNavigate()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadDocuments() {
    setLoading(true)
    setError('')

    documentsService
      .getAll()
      .then(setDocuments)
      .catch(() => setError('Não foi possível carregar os documentos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  return (
    <section className="remote-stack">
      <article className="remote-hero">
        <div>
          <p className="eyebrow">Mapeamento NoSQL</p>
          <h2>Contratos & Termos de Serviços</h2>
          <p>
            Gerenciamento integrado de documentos admissionais, termos contratuais e políticas de RH.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="new" className="primary-action">
            Criar Documento
          </Link>
        </div>
      </article>

      <article className="remote-card">
        <div className="remote-card-header">
          <div>
            <h3>Documentos Registrados</h3>
          </div>
          <div className="header-actions">
            <span>{documents.length} registros</span>
            <button type="button" className="secondary-action" onClick={loadDocuments}>
              Atualizar
            </button>
          </div>
        </div>

        {error ? <div className="feedback-card error">{error}</div> : null}

        {loading ? <div className="feedback-card">Carregando documentos...</div> : null}

        {!loading && documents.length === 0 ? (
          <div className="feedback-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
            Nenhum documento encontrado na base de dados. Clique em "Criar Documento" para registrar o primeiro.
          </div>
        ) : null}

        {!loading && documents.length > 0 ? (
          <div className="rh-table-wrapper">
            <table className="rh-table">
              <thead>
                <tr>
                  <th>Título / Identificador</th>
                  <th>Colaborador</th>
                  <th>Departamento</th>
                  <th>Assinaturas Pendentes</th>
                  <th>Última Atualização</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="rh-table-link-row"
                    onClick={() => navigate(String(doc.id))}
                  >
                    <td>
                      <strong className="rh-table-bold">{doc.title}</strong>
                      <span className="rh-table-sub">ID: {doc.id}</span>
                    </td>
                    <td>{doc.employeeName}</td>
                    <td>{doc.department}</td>
                    <td style={{ textAlign: 'center' }}>{doc.pendingSignatures}</td>
                    <td>{doc.updatedAt}</td>
                    <td>
                      <span className={`status-pill small ${doc.status}`}>
                        {doc.statusLabel || doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          setError('Documento não encontrado.')
          return
        }
        setDocument(response)
      })
      .catch(() => setError('Não foi possível obter os detalhes do documento.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    const shouldDelete = window.confirm('Deseja realmente excluir este documento permanentemente?')

    if (!shouldDelete) {
      return
    }

    setDeleting(true)

    try {
      await documentsService.remove(id)
      navigate('..', { relative: 'path' })
    } catch {
      setError('Falha ao excluir o documento.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="remote-card">Carregando detalhes do documento...</div>
  }

  if (error && !document) {
    return (
      <section className="remote-stack">
        <Link to=".." relative="path" className="inline-link">
          ← Voltar para documentos
        </Link>
        <div className="feedback-card error">{error}</div>
      </section>
    )
  }

  return (
    <section className="remote-stack">
      <div className="page-actions" style={{ justifyContent: 'space-between' }}>
        <Link to=".." relative="path" className="inline-link">
          ← Voltar para documentos
        </Link>
        <div className="header-actions">
          <Link to="edit" relative="path" className="secondary-action">
            Editar Informações
          </Link>
          <button type="button" className="danger-action" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      {error ? <div className="feedback-card error">{error}</div> : null}

      <article className="remote-card">
        <p className="eyebrow">Documento Digital</p>
        <h2 style={{ marginBottom: '12px' }}>{document.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
          {document.description}
        </p>

        <div className="details-grid">
          <div>
            <span>Colaborador Vinculado</span>
            <strong>{document.employeeName}</strong>
          </div>
          <div>
            <span>Setor Operacional</span>
            <strong>{document.department}</strong>
          </div>
          <div>
            <span>Fluxo de Assinaturas</span>
            <strong>{document.pendingSignatures} pendentes</strong>
          </div>
          <div>
            <span>Data de Modificação</span>
            <strong>{document.updatedAt}</strong>
          </div>
          <div>
            <span>Status do Processo</span>
            <strong>
              <span className={`status-pill small ${document.status}`}>
                {document.statusLabel || document.status}
              </span>
            </strong>
          </div>
          <div>
            <span>Código Identificador</span>
            <strong style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{document.id}</strong>
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
      .then((doc) => {
        if (!doc) {
          setError('Documento não encontrado para edição.')
          return
        }

        setForm({
          title: doc.title ?? '',
          employeeName: doc.employeeName ?? '',
          department: doc.department ?? '',
          status: doc.status ?? 'pending',
          pendingSignatures: doc.pendingSignatures ?? 0,
          description: doc.description ?? '',
        })
      })
      .catch(() => setError('Falha ao obter os dados do documento.'))
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
      const savedDoc = isEditing
        ? await documentsService.update(id, form)
        : await documentsService.create(form)

      navigate(isEditing ? '..' : `../${savedDoc.id}`, { relative: 'path' })
    } catch {
      setError(
        isEditing
          ? 'Ocorreu um erro ao salvar as alterações do documento.'
          : 'Ocorreu um erro ao registrar o novo documento.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="remote-stack">
      <div className="page-actions">
        <Link to=".." relative="path" className="inline-link">
          ← Cancelar Operação
        </Link>
      </div>

      <article className="remote-card">
        <p className="eyebrow">{isEditing ? 'Editor Cadastral' : 'Novo Registro'}</p>
        <h2 style={{ marginBottom: '20px' }}>{isEditing ? 'Editar Documento' : 'Registrar Novo Documento'}</h2>

        {error ? <div className="feedback-card error">{error}</div> : null}
        {loading ? <div className="feedback-card">Carregando dados do formulário...</div> : null}

        {!loading ? (
          <form className="document-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Título do Documento</span>
              <input
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Ex: Contrato de Trabalho, Acordo de Confidencialidade"
                required
              />
            </label>

            <div className="form-grid">
              <label className="field-group">
                <span>Colaborador</span>
                <input
                  value={form.employeeName}
                  onChange={(event) => updateField('employeeName', event.target.value)}
                  placeholder="Nome completo do colaborador"
                  required
                />
              </label>

              <label className="field-group">
                <span>Departamento</span>
                <input
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  placeholder="Ex: Engenharia, Operações, Comercial"
                  required
                />
              </label>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>Status do Fluxo</span>
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                <span>Assinaturas Pendentes</span>
                <input
                  type="number"
                  min="0"
                  value={form.pendingSignatures}
                  onChange={(event) => updateField('pendingSignatures', Number(event.target.value))}
                  required
                />
              </label>
            </div>

            <label className="field-group">
              <span>Descrição do Documento / Sumário</span>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Insira um breve resumo do objetivo ou termos principais do documento..."
                required
              />
            </label>

            <div className="page-actions" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="primary-action" disabled={saving}>
                {saving ? 'Gravando...' : isEditing ? 'Salvar Alterações' : 'Criar Documento'}
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

import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { peopleService } from '@gestao-rh/shared'
import '@gestao-rh/shared/styles/theme.css'

const emptyForm = {
  name: '',
  role: '',
  department: '',
  email: '',
  status: 'active',
  summary: '',
}

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'vacation', label: 'Férias' },
]

const statusLabelMap = {
  active: 'Ativo',
  inactive: 'Inativo',
  vacation: 'Férias',
  Ativo: 'Ativo',
  Inativo: 'Inativo',
  Ferias: 'Férias',
}

function PeopleListPage() {
  const navigate = useNavigate()
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function loadPeople() {
    setLoading(true)
    setError('')

    peopleService
      .getAll()
      .then((data) => {
        if (data) setPeople(data)
      })
      .catch(() => setError('Não foi possível carregar a lista de colaboradores.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPeople()
  }, [])

  return (
    <section className="remote-stack">
      <article className="remote-hero">
        <div>
          <p className="eyebrow">Domínio de Cadastro</p>
          <h2>Colaboradores & Setores</h2>
          <p>
            Painel operacional para administração de cargos, departamentos e contratos dos funcionários.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="new" className="primary-action">
            Adicionar Colaborador
          </Link>
        </div>
      </article>

      <article className="remote-card">
        <div className="remote-card-header">
          <div>
            <h3>Quadro de Funcionários</h3>
          </div>
          <div className="header-actions">
            <span>{people.length} colaboradores</span>
            <button type="button" className="secondary-action" onClick={loadPeople}>
              Atualizar
            </button>
          </div>
        </div>

        {error ? <div className="feedback-card error">{error}</div> : null}

        {loading ? <div className="feedback-card">Carregando quadro de funcionários...</div> : null}

        {!loading && people.length === 0 ? (
          <div className="feedback-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
            Nenhum colaborador registrado. Clique em "Adicionar Colaborador" para cadastrar o primeiro.
          </div>
        ) : null}

        {!loading && people.length > 0 ? (
          <div className="rh-table-wrapper">
            <table className="rh-table">
              <thead>
                <tr>
                  <th>Nome Completo</th>
                  <th>Cargo / Função</th>
                  <th>Departamento</th>
                  <th>E-mail Corporativo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {people.map((person) => (
                  <tr
                    key={person.id}
                    className="rh-table-link-row"
                    onClick={() => navigate(String(person.id))}
                  >
                    <td>
                      <strong className="rh-table-bold">{person.name}</strong>
                      <span className="rh-table-sub">ID: {person.id}</span>
                    </td>
                    <td>{person.role}</td>
                    <td>{person.department}</td>
                    <td>{person.email}</td>
                    <td>
                      <span className={`status-pill small ${person.status}`}>
                        {statusLabelMap[person.status] || person.status}
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

function PeopleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')

    peopleService
      .getById(id)
      .then((response) => {
        if (!response) {
          setError('Colaborador não encontrado.')
          return
        }
        setPerson(response)
      })
      .catch(() => setError('Não foi possível obter detalhes do colaborador.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    const shouldDelete = window.confirm('Deseja realmente desligar/excluir este colaborador do sistema?')

    if (!shouldDelete) {
      return
    }

    setDeleting(true)

    try {
      await peopleService.remove(id)
      navigate('..', { relative: 'path' })
    } catch {
      setError('Falha ao excluir o colaborador.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="remote-card">Carregando detalhes do colaborador...</div>
  }

  if (error && !person) {
    return (
      <section className="remote-stack">
        <Link to=".." relative="path" className="inline-link">
          ← Voltar para colaboradores
        </Link>
        <div className="feedback-card error">{error}</div>
      </section>
    )
  }

  return (
    <section className="remote-stack">
      <div className="page-actions" style={{ justifyContent: 'space-between' }}>
        <Link to=".." relative="path" className="inline-link">
          ← Voltar para colaboradores
        </Link>
        <div className="header-actions">
          <Link to="edit" relative="path" className="secondary-action">
            Editar Informações
          </Link>
          <button type="button" className="danger-action" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Removendo...' : 'Excluir'}
          </button>
        </div>
      </div>

      {error ? <div className="feedback-card error">{error}</div> : null}

      <article className="remote-card">
        <p className="eyebrow">Ficha Cadastral</p>
        <h2 style={{ marginBottom: '12px' }}>{person.name}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
          {person.summary || 'Nenhum sumário profissional inserido para este colaborador.'}
        </p>

        <div className="details-grid">
          <div>
            <span>Cargo / Função</span>
            <strong>{person.role}</strong>
          </div>
          <div>
            <span>Departamento</span>
            <strong>{person.department}</strong>
          </div>
          <div>
            <span>E-mail Institucional</span>
            <strong>{person.email}</strong>
          </div>
          <div>
            <span>Status Contratual</span>
            <strong>
              <span className={`status-pill small ${person.status}`}>
                {statusLabelMap[person.status] || person.status}
              </span>
            </strong>
          </div>
        </div>
      </article>
    </section>
  )
}

function PersonFormPage({ mode }) {
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

    peopleService
      .getById(id)
      .then((person) => {
        if (!person) {
          setError('Colaborador não encontrado para edição.')
          return
        }

        setForm({
          name: person.name ?? '',
          role: person.role ?? '',
          department: person.department ?? '',
          email: person.email ?? '',
          status: person.status ?? 'active',
          summary: person.summary ?? '',
        })
      })
      .catch(() => setError('Falha ao obter os dados do colaborador.'))
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
      const savedPerson = isEditing
        ? await peopleService.update(id, form)
        : await peopleService.create(form)

      navigate(isEditing ? '..' : `../${savedPerson.id || savedPerson.Id || ''}`, { relative: 'path' })
    } catch {
      setError(
        isEditing
          ? 'Ocorreu um erro ao salvar as alterações do colaborador.'
          : 'Ocorreu um erro ao registrar o novo colaborador.',
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
        <h2 style={{ marginBottom: '20px' }}>{isEditing ? 'Editar Ficha do Colaborador' : 'Registrar Novo Colaborador'}</h2>

        {error ? <div className="feedback-card error">{error}</div> : null}
        {loading ? <div className="feedback-card">Carregando dados do formulário...</div> : null}

        {!loading ? (
          <form className="document-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Nome Completo</span>
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Ex: Paulo César Muchalski"
                required
              />
            </label>

            <div className="form-grid">
              <label className="field-group">
                <span>Cargo / Função</span>
                <input
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  placeholder="Ex: Desenvolvedor Cloud, Analista Fiscal"
                  required
                />
              </label>

              <label className="field-group">
                <span>Departamento</span>
                <input
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  placeholder="Ex: TI, Finanças, Comercial"
                  required
                />
              </label>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>E-mail Corporativo</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="Ex: colaborador@empresa.com"
                  required
                />
              </label>

              <label className="field-group">
                <span>Status Contratual</span>
                <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field-group">
              <span>Sumário Profissional / Detalhes</span>
              <textarea
                rows="4"
                value={form.summary}
                onChange={(event) => updateField('summary', event.target.value)}
                placeholder="Descreva as principais responsabilidades, projetos ou observações operacionais..."
                required
              />
            </label>

            <div className="page-actions" style={{ justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="primary-action" disabled={saving}>
                {saving ? 'Gravando...' : isEditing ? 'Salvar Alterações' : 'Registrar Colaborador'}
              </button>
            </div>
          </form>
        ) : null}
      </article>
    </section>
  )
}

export default function PeopleApp() {
  return (
    <Routes>
      <Route index element={<PeopleListPage />} />
      <Route path="new" element={<PersonFormPage mode="create" />} />
      <Route path=":id" element={<PeopleDetailsPage />} />
      <Route path=":id/edit" element={<PersonFormPage mode="edit" />} />
    </Routes>
  )
}

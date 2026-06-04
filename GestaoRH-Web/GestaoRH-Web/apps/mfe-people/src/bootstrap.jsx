import { Link, Route, Routes, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { peopleService } from '@gestao-rh/shared'
import '@gestao-rh/shared/styles/theme.css'

function PeopleListPage() {
  const [people, setPeople] = useState([])

  useEffect(() => {
    peopleService.getAll().then(setPeople)
  }, [])

  return (
    <section className="remote-stack">
      <article className="remote-hero">
        <div>
          <p className="eyebrow">Remote independente</p>
          <h2>Funcionarios e setores</h2>
          <p>Feature pronta para consumir o BFF de pessoas quando os endpoints estiverem disponiveis.</p>
        </div>
        <div className="remote-chip">mfe-people</div>
      </article>

      <article className="remote-card">
        <div className="remote-card-header">
          <div>
            <p className="eyebrow">Funcionalidade 1</p>
            <h3>Listagem operacional</h3>
          </div>
          <span>{people.length} registros</span>
        </div>

        <div className="remote-list">
          {people.map((person) => (
            <Link key={person.id} to={String(person.id)} className="remote-list-item">
              <div>
                <strong>{person.name}</strong>
                <span>
                  {person.role} • {person.department}
                </span>
              </div>
              <span className={`status-pill small ${person.status === 'Ativo' ? '' : 'warn'}`}>
                {person.status}
              </span>
            </Link>
          ))}
        </div>
      </article>
    </section>
  )
}

function PeopleDetailsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)

  useEffect(() => {
    peopleService.getById(id).then(setPerson)
  }, [id])

  if (!person) {
    return <div className="remote-card">Carregando colaborador...</div>
  }

  return (
    <section className="remote-stack">
      <Link to=".." relative="path" className="inline-link">
        Voltar para pessoas
      </Link>
      <article className="remote-card">
        <p className="eyebrow">Funcionalidade 2</p>
        <h2>{person.name}</h2>
        <p>{person.summary}</p>

        <div className="details-grid">
          <div>
            <span>Cargo</span>
            <strong>{person.role}</strong>
          </div>
          <div>
            <span>Setor</span>
            <strong>{person.department}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{person.status}</strong>
          </div>
          <div>
            <span>E-mail</span>
            <strong>{person.email}</strong>
          </div>
        </div>
      </article>
    </section>
  )
}

export default function PeopleApp() {
  return (
    <Routes>
      <Route index element={<PeopleListPage />} />
      <Route path=":id" element={<PeopleDetailsPage />} />
    </Routes>
  )
}

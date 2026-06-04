import { useEffect, useState } from 'react'
import { dashboardService, isMockMode } from '@gestao-rh/shared'

const initialState = {
  summary: {
    employees: 0,
    documents: 0,
    pendingSignatures: 0,
  },
  people: [],
  documents: [],
  insights: [],
}

export default function OverviewPage() {
  const [state, setState] = useState(initialState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    dashboardService
      .getAggregatedData()
      .then((data) => {
        if (isMounted) setState(data)
      })
      .catch(() => {
        if (isMounted) setError('Nao foi possivel carregar o endpoint agregado do BFF.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="stack-lg">
      <section className="banner-card">
        <div>
          <p className="eyebrow">Endpoint obrigatorio</p>
          <h2>GET /aggregated-data</h2>
          <p>
            Esta tela representa o contrato principal da shell. No estado atual, ela deve apontar para o
            BFF, que agrega `people` mockado, `documents` do Mongo e o resumo enriquecido da camada
            intermediaria.
          </p>
        </div>
        <span className={`status-pill${isMockMode ? ' warn' : ''}`}>
          {isMockMode ? 'Mock local ativo' : 'BFF ativo'}
        </span>
      </section>

      {error ? (
        <article className="surface-card">
          <h2>Falha de integracao</h2>
          <p>{error}</p>
        </article>
      ) : null}

      <section className="metric-grid">
        <article className="metric-card">
          <span>Total de colaboradores</span>
          <strong>{loading ? '...' : state.summary.employees}</strong>
        </article>
        <article className="metric-card">
          <span>Documentos gerados</span>
          <strong>{loading ? '...' : state.summary.documents}</strong>
        </article>
        <article className="metric-card">
          <span>Assinaturas pendentes</span>
          <strong>{loading ? '...' : state.summary.pendingSignatures}</strong>
        </article>
      </section>

      <section className="card-grid">
        <article className="surface-card">
          <p className="eyebrow">Pessoas</p>
          <h2>Ultimos colaboradores</h2>
          <ul className="simple-list">
            {state.people.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                <span>
                  {person.department} • {person.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Documentos</p>
          <h2>Fluxo recente</h2>
          <ul className="simple-list">
            {state.documents.map((document) => (
              <li key={document.id}>
                <strong>{document.title}</strong>
                <span>
                  {document.employeeName} • {document.statusLabel}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card">
          <p className="eyebrow">Function ready</p>
          <h2>Insights de enriquecimento</h2>
          <ul className="simple-list">
            {state.insights.map((insight) => (
              <li key={insight}>
                <strong>{insight}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <article className="surface-card">
        <p className="eyebrow">Estado atual da integracao</p>
        <h2>Front para BFF para Microservico 1</h2>
        <p>
          <code>people</code> ainda pode vir de mock controlado pelo BFF, enquanto <code>documents</code>{' '}
          ja deve refletir o microservico MongoDB Atlas por tras da rota publica do BFF.
        </p>
      </article>
    </div>
  )
}

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
        if (isMounted && data) setState(data)
      })
      .catch(() => {
        if (isMounted) setError('Não foi possível obter a consolidação de dados da API.')
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
          <h2>Painel de Controle Central</h2>
          <p>
            Visão consolidada do departamento de Recursos Humanos. Este painel agrega indicadores operacionais de colaboradores, documentos regulatórios e insights gerados dinamicamente.
          </p>
        </div>
        <span className={`status-pill${isMockMode ? ' warn' : ''}`}>
          {isMockMode ? 'Mocks Ativos' : 'Dados em Tempo Real'}
        </span>
      </section>

      {error ? (
        <article className="feedback-card error">
          <strong>Aviso:</strong> {error}
        </article>
      ) : null}

      <section className="metric-grid">
        <article className="metric-card">
          <span>Colaboradores Cadastrados</span>
          <strong>{loading ? '...' : state.summary.employees}</strong>
        </article>
        <article className="metric-card">
          <span>Documentos Processados</span>
          <strong>{loading ? '...' : state.summary.documents}</strong>
        </article>
        <article className="metric-card">
          <span>Assinaturas Pendentes</span>
          <strong>{loading ? '...' : state.summary.pendingSignatures}</strong>
        </article>
      </section>

      <section className="card-grid">
        <article className="surface-card">
          <h2>Últimos Colaboradores</h2>
          <ul className="simple-list">
            {state.people.length === 0 && !loading ? (
              <li><span>Nenhum colaborador registrado.</span></li>
            ) : null}
            {state.people.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                <span>
                  {person.department} • {person.status === 'active' || person.status === 'Ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card">
          <h2>Documentos Recentes</h2>
          <ul className="simple-list">
            {state.documents.length === 0 && !loading ? (
              <li><span>Nenhum documento gerado.</span></li>
            ) : null}
            {state.documents.map((document) => (
              <li key={document.id}>
                <strong>{document.title}</strong>
                <span>
                  {document.employeeName} • {document.statusLabel || document.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="surface-card">
          <h2>Alertas & Insights</h2>
          <div className="stack-lg" style={{ marginTop: '16px', gap: '12px' }}>
            {state.insights.length === 0 && !loading ? (
              <div className="insight-text">Sem novos alertas no sistema.</div>
            ) : null}
            {state.insights.map((insight, index) => (
              <div key={index} className="insight-text">
                🔔 {insight}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

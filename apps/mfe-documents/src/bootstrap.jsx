import { Link, Route, Routes, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { documentsService } from '@gestao-rh/shared'
import '@gestao-rh/shared/styles/theme.css'

function DocumentsListPage() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    documentsService.getAll().then(setDocuments)
  }, [])

  return (
    <section className="remote-stack">
      <article className="remote-hero">
        <div>
          <p className="eyebrow">Remote independente</p>
          <h2>Documentos e assinaturas</h2>
          <p>Feature preparada para usar o BFF sem chamar diretamente microservices ou banco.</p>
        </div>
        <div className="remote-chip">mfe-documents</div>
      </article>

      <article className="remote-card">
        <div className="remote-card-header">
          <div>
            <p className="eyebrow">Funcionalidade 1</p>
            <h3>Listagem de documentos</h3>
          </div>
          <span>{documents.length} documentos</span>
        </div>

        <div className="remote-list">
          {documents.map((document) => (
            <Link key={document.id} to={String(document.id)} className="remote-list-item">
              <div>
                <strong>{document.title}</strong>
                <span>
                  {document.employeeName} • {document.department}
                </span>
              </div>
              <span className={`status-pill small ${document.pendingSignatures > 0 ? 'warn' : ''}`}>
                {document.statusLabel}
              </span>
            </Link>
          ))}
        </div>
      </article>
    </section>
  )
}

function DocumentDetailsPage() {
  const { id } = useParams()
  const [document, setDocument] = useState(null)

  useEffect(() => {
    documentsService.getById(id).then(setDocument)
  }, [id])

  if (!document) {
    return <div className="remote-card">Carregando documento...</div>
  }

  return (
    <section className="remote-stack">
      <Link to=".." relative="path" className="inline-link">
        Voltar para documentos
      </Link>
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
        </div>
      </article>
    </section>
  )
}

export default function DocumentsApp() {
  return (
    <Routes>
      <Route index element={<DocumentsListPage />} />
      <Route path=":id" element={<DocumentDetailsPage />} />
    </Routes>
  )
}

import { deleteFromBff, getFromBff, postToBff, putToBff } from './httpClient'
import { mockDocuments } from './mockData'

const statusLabelMap = {
  draft: 'Rascunho',
  pending: 'Aguardando assinatura',
  partially_signed: 'Parcialmente assinado',
  completed: 'Concluido',
  cancelled: 'Cancelado',
  aguardando_assinatura: 'Aguardando assinatura',
  parcial: 'Parcialmente assinado',
  concluido: 'Concluido',
}

function formatDate(value) {
  if (!value) {
    return 'Nao informado'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value)
  }

  return parsedDate.toLocaleDateString('pt-BR')
}

function normalizePendingSignatures(value) {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

function normalizeDocument(document) {
  if (!document) {
    return null
  }

  const status = document.status ?? 'pending'
  const pendingSignatures = normalizePendingSignatures(document.pendingSignatures)

  return {
    id: String(document.id ?? document.documentId ?? ''),
    title: document.title ?? document.name ?? 'Documento sem titulo',
    employeeName: document.employeeName ?? document.employee ?? document.ownerName ?? document.owner ?? 'Nao informado',
    department: document.department ?? document.area ?? document.category ?? 'Nao informado',
    status,
    statusLabel: document.statusLabel ?? statusLabelMap[status] ?? status,
    pendingSignatures,
    updatedAt: formatDate(
      document.updatedAt ??
        document.updatedOn ??
        document.updatedAtUtc ??
        document.lastUpdatedAt ??
        document.lastUpdatedAtUtc,
    ),
    description: document.description ?? document.summary ?? document.content ?? 'Sem descricao informada.',
  }
}

function toDocumentPayload(document) {
  return {
    title: document.title?.trim() ?? '',
    employeeName: document.employeeName?.trim() ?? '',
    department: document.department?.trim() ?? '',
    description: document.description?.trim() ?? '',
    status: document.status ?? 'pending',
    pendingSignatures: normalizePendingSignatures(document.pendingSignatures),
  }
}

let mockDocumentsState = [...mockDocuments]

function createMockDocument(document) {
  const newDocument = normalizeDocument({
    ...toDocumentPayload(document),
    id: `mock-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  })

  mockDocumentsState = [newDocument, ...mockDocumentsState]
  return newDocument
}

function updateMockDocument(id, document) {
  let updatedDocument = null

  mockDocumentsState = mockDocumentsState.map((currentDocument) => {
    if (String(currentDocument.id) !== String(id)) {
      return currentDocument
    }

    updatedDocument = normalizeDocument({
      ...currentDocument,
      ...toDocumentPayload(document),
      id: currentDocument.id,
      updatedAt: new Date().toISOString(),
    })

    return updatedDocument
  })

  return updatedDocument
}

function deleteMockDocument(id) {
  mockDocumentsState = mockDocumentsState.filter((document) => String(document.id) !== String(id))
  return null
}

export const documentsService = {
  getAll: () => getFromBff('/documents', async () => mockDocumentsState).then((documents) => documents.map(normalizeDocument)),
  getById: (id) =>
    getFromBff(
      `/documents/${id}`,
      async () => mockDocumentsState.find((document) => String(document.id) === String(id)),
    ).then(normalizeDocument),
  create: (document) =>
    postToBff('/documents', toDocumentPayload(document), async () => createMockDocument(document)).then(normalizeDocument),
  update: (id, document) =>
    putToBff(`/documents/${id}`, toDocumentPayload(document), async () => updateMockDocument(id, document)).then(
      normalizeDocument,
    ),
  remove: (id) => deleteFromBff(`/documents/${id}`, async () => deleteMockDocument(id)),
}

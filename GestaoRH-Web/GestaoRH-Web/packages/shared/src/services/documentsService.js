import { getFromBff } from './httpClient'
import { mockDocuments } from './mockData'

export const documentsService = {
  getAll: () => getFromBff('/documents', async () => mockDocuments),
  getById: (id) =>
    getFromBff(
      `/documents/${id}`,
      async () => mockDocuments.find((document) => String(document.id) === String(id)),
    ),
}

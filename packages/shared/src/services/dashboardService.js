import { getFromBff } from './httpClient'
import { mockAggregatedData } from './mockData'

function normalizeAggregatedData(data) {
  if (!data) return null

  // Check if response format is from the real BFF
  const isRealBff = data.functionData !== undefined || data.client !== undefined

  if (isRealBff) {
    const people = data.people || []
    const documents = data.documents || []
    const functionData = data.functionData || {}

    return {
      people: people.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        department: p.department,
        status: p.status,
        email: p.email || '',
      })),
      documents: documents.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.department ?? d.category,
        employeeName: d.employeeName ?? d.owner,
        statusLabel: d.status,
        status: d.status,
      })),
      summary: {
        employees: functionData.totalPeople ?? people.length,
        documents: functionData.totalDocuments ?? documents.length,
        pendingSignatures: documents.reduce((sum, d) => sum + Number(d.pendingSignatures ?? 0), 0),
      },
      insights: functionData.message
        ? [functionData.message]
        : ['Nenhum alerta ou insight pendente no momento.'],
      source: functionData.source || 'BFF',
    }
  }

  // Fallback to mock data format
  return {
    people: data.people || [],
    documents: data.documents || [],
    summary: {
      employees: data.summary?.employees ?? 0,
      documents: data.summary?.documents ?? 0,
      pendingSignatures: data.summary?.pendingSignatures ?? 0,
    },
    insights: data.insights || [],
    source: 'Mock Local',
  }
}

export const dashboardService = {
  getAggregatedData: () =>
    getFromBff('/aggregated-data', async () => mockAggregatedData).then(normalizeAggregatedData),
}


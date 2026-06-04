export const mockPeople = [
  {
    id: 1,
    name: 'Marina Souza',
    role: 'Analista de RH',
    department: 'People Ops',
    status: 'Ativo',
    email: 'marina.souza@empresa.com',
    summary: 'Responsavel pela jornada de admissao e indicadores de onboarding.',
  },
  {
    id: 2,
    name: 'Carlos Lima',
    role: 'Coordenador',
    department: 'Treinamento',
    status: 'Ativo',
    email: 'carlos.lima@empresa.com',
    summary: 'Acompanha trilhas de capacitacao e performance dos lideres.',
  },
  {
    id: 3,
    name: 'Ana Costa',
    role: 'Assistente',
    department: 'Documentacao',
    status: 'Ferias',
    email: 'ana.costa@empresa.com',
    summary: 'Organiza fluxos de documentos contratuais e assinaturas digitais.',
  },
]

export const mockDocuments = [
  {
    id: 101,
    title: 'Contrato de experiencia',
    employeeName: 'Marina Souza',
    department: 'People Ops',
    status: 'aguardando_assinatura',
    statusLabel: 'Aguardando assinatura',
    pendingSignatures: 2,
    updatedAt: '01/06/2026',
    description: 'Documento enviado para validacao do colaborador e aprovacao da lideranca.',
  },
  {
    id: 102,
    title: 'Termo de beneficios',
    employeeName: 'Carlos Lima',
    department: 'Treinamento',
    status: 'concluido',
    statusLabel: 'Concluido',
    pendingSignatures: 0,
    updatedAt: '31/05/2026',
    description: 'Fluxo finalizado com registro persistido no backend de documentos.',
  },
  {
    id: 103,
    title: 'Aditivo de jornada',
    employeeName: 'Ana Costa',
    department: 'Documentacao',
    status: 'parcial',
    statusLabel: 'Parcialmente assinado',
    pendingSignatures: 1,
    updatedAt: '30/05/2026',
    description: 'Aguardando assinatura do gestor antes da conclusao do processo.',
  },
]

export const mockAggregatedData = {
  summary: {
    employees: mockPeople.length,
    documents: mockDocuments.length,
    pendingSignatures: mockDocuments.reduce((sum, item) => sum + item.pendingSignatures, 0),
  },
  people: mockPeople.slice(0, 3),
  documents: mockDocuments.slice(0, 3),
  insights: [
    'Azure Function pode enriquecer alertas com risco de atraso em assinatura.',
    'BFF consegue agregar funcionarios, documentos e calculos em uma unica resposta.',
    'Shell e remotes permanecem desacoplados das fontes de dados reais.',
  ],
}

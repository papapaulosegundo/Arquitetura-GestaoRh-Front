import { getFromBff } from './httpClient'
import { mockAggregatedData } from './mockData'

export const dashboardService = {
  getAggregatedData: () => getFromBff('/aggregated-data', async () => mockAggregatedData),
}

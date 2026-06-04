import { getFromBff } from './httpClient'
import { mockPeople } from './mockData'

export const peopleService = {
  getAll: () => getFromBff('/people', async () => mockPeople),
  getById: (id) =>
    getFromBff(`/people/${id}`, async () => mockPeople.find((person) => String(person.id) === String(id))),
}

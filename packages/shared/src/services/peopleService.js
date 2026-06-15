import { getFromBff, postToBff, putToBff, deleteFromBff } from './httpClient'
import { mockPeople } from './mockData'

let mockPeopleState = [...mockPeople]

function createMockPerson(person) {
  const newPerson = {
    ...person,
    id: mockPeopleState.length > 0 ? Math.max(...mockPeopleState.map((p) => p.id)) + 1 : 1,
    status: person.status || 'active',
  }
  mockPeopleState = [...mockPeopleState, newPerson]
  return newPerson
}

function updateMockPerson(id, person) {
  let updatedPerson = null
  mockPeopleState = mockPeopleState.map((currentPerson) => {
    if (String(currentPerson.id) !== String(id)) {
      return currentPerson
    }
    updatedPerson = {
      ...currentPerson,
      ...person,
      id: currentPerson.id,
    }
    return updatedPerson
  })
  return updatedPerson
}

function deleteMockPerson(id) {
  mockPeopleState = mockPeopleState.filter((person) => String(person.id) !== String(id))
  return null
}

export const peopleService = {
  getAll: () => getFromBff('/people', async () => mockPeopleState),
  getById: (id) =>
    getFromBff(`/people/${id}`, async () => mockPeopleState.find((person) => String(person.id) === String(id))),
  create: (person) =>
    postToBff('/people', person, async () => createMockPerson(person)),
  update: (id, person) =>
    putToBff(`/people/${id}`, person, async () => updateMockPerson(id, person)),
  remove: (id) =>
    deleteFromBff(`/people/${id}`, async () => deleteMockPerson(id)),
}


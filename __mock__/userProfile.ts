import {axiosMockAdapterInstance} from '../lib/axiosConfig'

const mockUserProfile = {
    id: '1',
    username: 'test user',
    password: 'Password123!',
    email: 'testuser@email.com',
    accessToken: 'abc',
}
axiosMockAdapterInstance
    .onPost('/login')
    .reply(200, mockUserProfile)

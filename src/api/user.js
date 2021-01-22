import { END } from 'redux-saga';
import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class UserService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.USERS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getAllByCustomerId(customerId, token) {
        console.log('getallbycustomerid')
        return super
            .fetch(`${ENDPOINTS.USERS}/customer/${customerId}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    save(token, body) {
        return super
            .fetch(`${ENDPOINTS.USERS}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    update(token, body) {
        return super
            .fetch(`${ENDPOINTS.USERS}`, 'PATCH', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    delete(body, token) {
        return super
            .fetch(`${ENDPOINTS.USERS}`, 'DELETE', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

}

export default new UserService();
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

    save(token, body) {
        return super
            .fetch(`${ENDPOINTS.USERS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    update(userId, body, token) {
        return super
        .fetch(`${ENDPOINTS.USERS}/${userId}`, 'PUT', token, body)
        .then((data) => super.parseJSON(data))
        .catch((error) => Promise.reject(new Error(error.message)));
    }

    delete(body, token) {
        console.log("user.js")
        console.log(body)
        return super.fetch(`${ENDPOINTS.USERS}`, 'DELETE', body, token)
        .then((data) => super.parseJSON(data))
        .catch((error) => Promise.reject(new Error(error.message)));
    }

}

export default new UserService();
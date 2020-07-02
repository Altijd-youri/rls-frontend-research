import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class OwnerService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.OWNERS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    save(token, body) {
        return super
            .fetch(`${ENDPOINTS.OWNERS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    update(ownerId, token, body) {
        return super
            .fetch(`${ENDPOINTS.OWNERS}/${ownerId}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new OwnerService();
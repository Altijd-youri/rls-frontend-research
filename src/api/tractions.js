import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TractionService extends FetchService {
    getTractions(token) {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveTraction(body, token) {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error)));
    }

    editTraction(tractionId, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}/${tractionId}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error)));
    }
}

export default new TractionService();
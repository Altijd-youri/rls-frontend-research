import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TractionService extends FetchService {
    getTractions() {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveTraction(body) {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error)));
    }

    editTraction(body) {
        return super
            .fetch(`${ENDPOINTS.TRACTIONS}`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error)));
    }
}

export default new TractionService();
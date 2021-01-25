import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class WagonService extends FetchService {
    getWagons(token) {
        return super
            .fetch(`${ENDPOINTS.WAGONS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveWagon(body, token) {
        return super
            .fetch(`${ENDPOINTS.WAGONS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    editWagon(wagonId, body, token) {
        return super
            .fetch(`${ENDPOINTS.WAGONS}/${wagonId}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteWagon(wagonId, token) {
        return super
            .fetch(`${ENDPOINTS.WAGONS}/${wagonId}`, 'DELETE', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new WagonService();
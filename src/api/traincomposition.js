import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainCompositionService extends FetchService {
    saveStock(trainCompositionId, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    updateStock(trainCompositionId, stockId, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteStock(trainCompositionId, stockId, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}`, 'DELETE', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    moveStock(trainCompositionId, stockId, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}/move`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainCompositionService();
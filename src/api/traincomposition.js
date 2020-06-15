import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainCompositionService extends FetchService {
    saveStock(trainCompositionId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    updateStock(trainCompositionId, stockId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}`, 'PUT', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteStock(trainCompositionId, stockId) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}`, 'DELETE')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    moveStock(trainCompositionId, stockId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock/${stockId}/move`, 'PUT', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainCompositionService();
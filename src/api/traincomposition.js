import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainCompositionService extends FetchService {
    saveTraction(trainCompositionId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/tractions`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveWagon(trainCompositionId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/wagons`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteWagon(trainCompositionId, wagonId) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/wagons/${wagonId}`, 'DELETE')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteTraction(trainCompositionId, tractionId) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/tractions/${tractionId}`, 'DELETE')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainCompositionService();
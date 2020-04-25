import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainService extends FetchService {
    getTrains() {
        return super
            .fetch(`${ENDPOINTS.TRAINS}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveTrain(body) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getTrain(trainid) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainid}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    async saveRoute(trainid, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainid}/journeysections`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainService();

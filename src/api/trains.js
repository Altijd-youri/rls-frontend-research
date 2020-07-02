import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainService extends FetchService {
    getTrains(token) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    sendTcm(token, trainId) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainId}/send`, 'POST', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveTrain(body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getTrain(trainid, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainid}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    editTrain(trainid, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainid}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveJourney(trainid, body, token) {
        return super
            .fetch(`${ENDPOINTS.TRAINS}/${trainid}/journeysections`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    editJourney(url, body, token) {
        return super
            .fetch(url, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainService();

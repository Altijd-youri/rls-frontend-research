import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class JourneySectionService extends FetchService {
    clone(journeySectionId, body, token) {
        return super
            .fetch(`${ENDPOINTS.JOURNEYSECTIONS}/${journeySectionId}/clone`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getJourneySectionById(journeySectionId, token) {
        return super
            .fetch(`${ENDPOINTS.JOURNEYSECTIONS}/${journeySectionId}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

}

export default new JourneySectionService();
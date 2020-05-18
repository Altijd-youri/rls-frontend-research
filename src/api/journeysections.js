import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class JourneySectionService extends FetchService {
    clone(journeySectionId, body) {
        return super
            .fetch(`${ENDPOINTS.JOURNEYSECTIONS}/${journeySectionId}/clone`, 'PUT', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new JourneySectionService();
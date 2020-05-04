import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class WagonService extends FetchService {
    getWagons() {
        return super
            .fetch(`${ENDPOINTS.WAGONS}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new WagonService();
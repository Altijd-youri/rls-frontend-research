import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class LocationsService extends FetchService {
    getLocations() {
        return super
            .fetch(`${ENDPOINTS.LOCATIONS}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new LocationsService();
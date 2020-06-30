import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class LocationsService extends FetchService {
    getLocations(token) {
        return super
            .fetch(`${ENDPOINTS.LOCATIONS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    getLocationsByHateoas(url, token) {
        return super
            .fetch(`${url}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new LocationsService();
import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainActivitiesService extends FetchService {
    getActivities(token) {
        return super
            .fetch(`${ENDPOINTS.TRAINACTIVITYTYPES}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainActivitiesService();
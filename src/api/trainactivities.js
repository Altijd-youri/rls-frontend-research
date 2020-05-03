import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainActivitiesService extends FetchService {
    getActivities() {
        return super
            .fetch(`${ENDPOINTS.TRAINACTIVITYTYPES}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainActivitiesService();
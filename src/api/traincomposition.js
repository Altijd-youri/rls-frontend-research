import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TrainCompositionService extends FetchService {
    saveTraction(trainCompositionId, body) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/tractions`, 'POST', body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TrainCompositionService();
import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class RollingStockService extends FetchService {
    getStockByTrainCompositionId(trainCompositionId) {
        return super
            .fetch(`${ENDPOINTS.TRAINCOMPOSITIONS}/${trainCompositionId}/stock`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new RollingStockService();
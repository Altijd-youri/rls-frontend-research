import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class DangerGoodsTypesService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.DANGERGOODSTYPES}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new DangerGoodsTypesService();
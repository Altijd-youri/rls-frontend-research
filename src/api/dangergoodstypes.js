import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class DangerGoodsTypesService extends FetchService {
    getAll() {
        return super
            .fetch(`${ENDPOINTS.DANGERGOODSTYPES}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new DangerGoodsTypesService();
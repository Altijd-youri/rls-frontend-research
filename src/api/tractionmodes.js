import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class TractionModeService extends FetchService {
    getTractionModes() {
        return super
            .fetch(`${ENDPOINTS.TRACTIONMODES}`, 'GET')
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new TractionModeService();
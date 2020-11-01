import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class CompanyService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.COMPANIES}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteCompany(companyCode, token) {
        return super
            .fetch(`${ENDPOINTS.COMPANIES}/${companyCode}`, 'DELETE', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new CompanyService();
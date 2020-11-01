import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class CustomerService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    save(token, body) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'POST', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    update(customerId, body, token) {
        return super
        .fetch(`${ENDPOINTS.CUSTOMERS}/${customerId}`, 'PUT', token, body)
        .then((data) => super.parseJSON(data))
        .catch((error) => Promise.reject(new Error(error.message)));
    }

    deleteCompany(customerId, token) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}/${customerId}`, 'DELETE', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new CustomerService();
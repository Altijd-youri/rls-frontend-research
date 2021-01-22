import { ENDPOINTS } from '../utils/constants';
import FetchService from './fetchservice';

class CustomerService extends FetchService {
    getAll(token) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'GET', token)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveCustomer(token, body) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    saveUser(token, body) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}/users`, 'PUT', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    update(token, body) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'PATCH', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }

    delete(body, token) {
        return super
            .fetch(`${ENDPOINTS.CUSTOMERS}`, 'DELETE', token, body)
            .then((data) => super.parseJSON(data))
            .catch((error) => Promise.reject(new Error(error.message)));
    }
}

export default new CustomerService();
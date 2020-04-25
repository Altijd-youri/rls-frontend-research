const defaultOptions = {
    GET: {
        method: 'GET',
    },
    PATCH: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'PATCH'
    },
    PUT: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'PUT'
    },
    POST: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST'
    },
    DELETE: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'DELETE'
    }
};

export default class FetchService {
    /**
     *
     * @param {string} endpoint endpoint to call
     * @param {string} type request type automatically includes default request options
     * @param {object} customOptions options object to override default options
     * @param {object} body form body object
     */
    fetch(endpoint, type, body) {
        const options = Object.assign({}, defaultOptions[type], { body: JSON.stringify(body) });
        return fetch(endpoint, options);
    }

    /**
     *
     * @param {object} response http response object
     * returns object {data, error}
     * always expect to receive JSON response
     * if we do not return response as data or error object
     */
    parseJSON(response) {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            return response.json()
                .catch((error) => Promise.reject(new Error(`Invalid JSON: ${error.message}`)));
        }

        if (contentType && contentType.includes('text/plain')) {
            return response.text()
                .then((text) => {
                    return Promise.resolve({
                        data: response.ok ? text : undefined,
                        error: response.ok ? undefined : text,
                    });
                })
                .catch((error) => Promise.reject(new Error(`Invalid TEXT: ${error.message}`)));
        }

        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                return {
                    data: undefined,
                    error: { response },
                };
            }
            return {
                data: { response },
                error: undefined,
            };
        }
        return response.json()
            .then((data) => Promise.resolve(data))
            .catch((error) => Promise.reject(new Error(`Invalid JSON: ${error}`)))
    }
}

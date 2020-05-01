export const defaultOptions = {
    GET: {
        method: 'GET',
    },
    PATCH: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'PATCH'
    },
    POST: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'POST'
    },
    PUT: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'PUT'
    },
    DELETE: {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'DELETE'
    }
};

export default function fetchHelper(endpoint, type, body, callback) {
    let options;
    if (body && Object.keys(body).length) {
        options = Object.assign({}, defaultOptions[type], { body: JSON.stringify(body) });
    } else {
        options = Object.assign({}, defaultOptions[type]);
    }
    fetch(endpoint, options)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.status
                return Promise.reject(error);
            }
            callback({ data, error: undefined });
        }).catch(errorMessage => {
            callback({ data: undefined, error: errorMessage })
        })
}


/*  Example

fetchHelper(ENDPOINTS.account, 'POST', body, ({ data, error }) => {
                    if (data) {

                    } else {

                    }
                })

*/
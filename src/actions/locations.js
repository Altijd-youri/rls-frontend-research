export const LOCATIONS_REQUEST = 'App/LOCATIONS_REQUEST';
export function locationsRequest() {
    return {
        type: LOCATIONS_REQUEST
    };
}

export const LOCATIONS_SUCCESS = 'App/LOCATIONS_SUCCESS';
export function locationsSuccess(locations) {
    return {
        type: LOCATIONS_SUCCESS,
        payload: {
            locations,
        },
    };
}

export const LOCATIONS_ERROR = 'App/LOCATIONS_ERROR';
export function locationsError(error) {
    return {
        type: LOCATIONS_ERROR,
        payload: {
            error,
        },
    };
}
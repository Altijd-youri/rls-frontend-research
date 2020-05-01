export const TRAINS_REQUEST = 'App/TRAINS_REQUEST';
export function trainsRequest() {
    return {
        type: TRAINS_REQUEST
    };
}

export const TRAINS_SUCCESS = 'App/TRAINS_SUCCESS';
export function trainsSuccess(trains) {
    return {
        type: TRAINS_SUCCESS,
        payload: {
            trains,
        },
    };
}

export const TRAINS_ERROR = 'App/TRAINS_ERROR';
export function trainsError(error) {
    return {
        type: TRAINS_ERROR,
        payload: {
            error,
        },
    };
}

export const SAVE_TRAIN_REQUEST = 'App/SAVE_TRAIN_REQUEST';
export function saveTrainRequest(body) {
    return {
        type: SAVE_TRAIN_REQUEST,
        payload: {
            body
        }
    };
}

export const SAVE_TRAIN_SUCCESS = 'App/SAVE_TRAIN_SUCCESS';
export function saveTrainSuccess(train) {
    return {
        type: SAVE_TRAIN_SUCCESS,
        payload: {
            train,
        },
    };
}

export const SAVE_TRAIN_ERROR = 'App/SAVE_TRAIN_ERROR';
export function saveTrainError(error) {
    return {
        type: SAVE_TRAIN_ERROR,
        payload: {
            error,
        },
    };
}


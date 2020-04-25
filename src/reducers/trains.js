import {
    TRAINS_SUCCESS,
    TRAINS_REQUEST,
    TRAINS_ERROR,
    SAVE_TRAIN_SUCCESS
} from "../actions/trains";

export const INITIAL_STATE = {
    trains: [],
    isFetching: false,
    error: ""
};

function trainsReducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case TRAINS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: ""
            };
        case TRAINS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: "",
                trains: action.payload.trains.sort((a, b) => new Date(b.scheduledDateTimeAtTransfer) - new Date(a.scheduledDateTimeAtTransfer))
            };
        case TRAINS_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.error
            };
        case SAVE_TRAIN_SUCCESS:
            let oldList = state.trains.concat(action.payload.train);
            return {
                ...state,
                isFetching: false,
                error: "",
                trains: oldList.sort((a, b) => new Date(b.scheduledDateTimeAtTransfer) - new Date(a.scheduledDateTimeAtTransfer))
            };
        default:
            return state;
    }
}

export default trainsReducer;

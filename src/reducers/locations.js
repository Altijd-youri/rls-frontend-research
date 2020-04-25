import { LOCATIONS_SUCCESS, LOCATIONS_REQUEST, LOCATIONS_ERROR } from '../actions/locations'

export const INITIAL_STATE = {
    locations: [],
    isFetching: false,
    error: '',
};

function locationsReducer(state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case LOCATIONS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: '',
            };
        case LOCATIONS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: '',
                locations: action.payload.locations.sort((a, b) => a.primaryLocationName.localeCompare(b.primaryLocationName))
            };
        case LOCATIONS_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
}

export default locationsReducer;
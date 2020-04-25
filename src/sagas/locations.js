import { takeLatest, all, call, put, select } from 'redux-saga/effects';

import LocationsService from '../api/locations'
import {
    locationsSuccess,
    locationsError,
    LOCATIONS_REQUEST,
} from '../actions/locations';

export function* getLocationsSaga() {
    try {
        let locations = yield select(state => state.locationsStore.locations);
        if (!locations.length) {
            const { data, error } = yield call(LocationsService.getLocations);
            if (error) {
                throw new Error(error.message)
            }
            locations = data;
        }
        yield put(locationsSuccess(locations));
        return locations;
    } catch (error) {
        yield put(locationsError(error.message));
        return error;
    }
}

export function* watchGetLocations() {
    yield all([takeLatest(LOCATIONS_REQUEST, getLocationsSaga)]);
}

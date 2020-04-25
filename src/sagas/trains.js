import { takeLatest, all, call, put } from 'redux-saga/effects';

import TrainService from '../api/trains'
import {
    trainsSuccess,
    trainsError,
    TRAINS_REQUEST,
    SAVE_TRAIN_REQUEST,
    saveTrainSuccess,
} from '../actions/trains';

// import { succeedAlert, errorAlert } from '../utils/alerts'

export function* getTrainsSaga() {
    try {
        const { data, error } = yield call(TrainService.getTrains);
        if (error) {
            throw new Error(error.message)
        }
        yield put(trainsSuccess(data));
        return data;
    } catch (error) {
        yield put(trainsError(error.message));
        return error;
    }
}

export function* watchGetTrains() {
    yield all([takeLatest(TRAINS_REQUEST, getTrainsSaga)]);
}

export function* saveTrainSaga({ payload }) {
    try {
        const { data, error } = yield call(TrainService.saveTrain, payload.body);
        if (error) {
            throw new Error(error.message);
        }
        yield put(saveTrainSuccess(data));
        // yield call(succeedAlert);
        return data;
    } catch (error) {
        // yield call(errorAlert, error);
        return error;
    }
}

export function* watchSaveTrain() {
    yield all([takeLatest(SAVE_TRAIN_REQUEST, saveTrainSaga)]);
}

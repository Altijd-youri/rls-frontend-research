import { all } from 'redux-saga/effects';
import { watchGetTrains, watchSaveTrain } from './trains';
import { watchGetLocations } from './locations';

export default function* rootSaga() {
    yield all([
        watchGetTrains(),
        watchSaveTrain(),
        watchGetLocations(),
    ]);
}
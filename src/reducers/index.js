import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import trainsReducer from './trains';
import locationsReducer from './locations';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    trainsStore: trainsReducer,
    locationsStore: locationsReducer,
})

export default rootReducer;

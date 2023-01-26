import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { adminConfig } from "./admin-config.reducer";
import { addPlaceReducer, placesReducer } from "./place.reducer"
import { userReducer } from "./user.reducer";

const rootReducer = combineReducers({ authentication, adminConfig, addPlaceReducer, placesReducer, userReducer });

export default rootReducer;
import { placeConstant } from "../constants";

const addPlaceInitialState = { isError: false };

export function addPlaceReducer(state = addPlaceInitialState, action) {
    switch (action.type) {
        case placeConstant.ADD_PLACE_REQUEST:
        case placeConstant.ADD_PLACE_SUCCESS:
        case placeConstant.ADD_PLACE_RESET:
            return addPlaceInitialState;
        case placeConstant.ADD_PLACE_FAILURE:
            return { ...state, isError: true }
        default: return state
    }
}


const initialPlacesState = {
    isLoading: false,
    isError: false,
    places: []
}

export function placesReducer(state = initialPlacesState, action) {
    switch (action.type) {
        case placeConstant.FETCH_ALL_PLACES:
            return {
                ...state,
                isLoading: true,
                isError: false,

            };
        case placeConstant.FETCH_ALL_PLACES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isError: false,
                places: action.payload
            };
        case placeConstant.FETCH_ALL_PLACES_FAILURE:
            return {
                places: [],
                isLoading: false,
                isError: true,
            }
        default: return state
    }
}
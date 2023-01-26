import { placeConstant } from "../constants";
import { placeService } from "../services"

function addPlaceRequest() {
    return ({ type: placeConstant.ADD_PLACE_REQUEST })
}

function addPlaceSuccess() {
    return ({ type: placeConstant.ADD_PLACE_SUCCESS })
}

function addPlaceFailure() {
    return ({ type: placeConstant.ADD_PLACE_FAILURE })
}

function addPlaceRest() {
    return ({ type: placeConstant.ADD_PLACE_RESET })
}


function fetchPlaces() {
    return function (dispatch) {
        dispatch({ type: placeConstant.FETCH_ALL_PLACES })
        placeService.getAllPlace().then(function (response) {
            const { data: { places } } = response;
            dispatch({ type: placeConstant.FETCH_ALL_PLACES_SUCCESS, payload: places });
        }).catch(function (error) {
            dispatch({ type: placeConstant.FETCH_ALL_PLACES_FAILURE })
        })
    }
}

export const placeActions = { addPlaceRequest, addPlaceSuccess, addPlaceFailure, addPlaceRest, fetchPlaces }
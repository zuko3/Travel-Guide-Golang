import { userConstants } from "../constants";
import { adminService } from "../services";

function fetchUsers() {
    return function (dispatch) {
        dispatch({ type: userConstants.USERS_LOADING })
        adminService.allusers().then(function (response) {
            const { data: { users } } = response;
            dispatch({ type: userConstants.USERS_LOADING_SUCCESS, payload: users });
        }).catch(function (error) {
            dispatch({ type: userConstants.USERS_LOADING_ERROR })
        })
    }
}

export const userAction = { fetchUsers }
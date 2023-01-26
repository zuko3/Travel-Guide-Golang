import { adminConstants } from "../constants";

const initialState = { isLoading: false, isError: false, data: null }

export function authentication(state = initialState, action) {
    switch (action.type) {
        case adminConstants.LOGIN_REQUEST:
            return {
                ...initialState,
                isLoading: true
            };
        case adminConstants.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload
            }
        case adminConstants.ADMIN_PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.payload
                }
            }
        case adminConstants.LOGOUT_REQUEST:
            return {
                ...state,
                data: null
            }
        case adminConstants.LOGIN_FAILURE:
            return {
                ...state,
                isError: true,
                isLoading: false,
                data: null
            }
        default:
            return state;
    }
}

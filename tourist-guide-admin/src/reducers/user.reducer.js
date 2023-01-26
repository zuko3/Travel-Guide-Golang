import { userConstants } from "../constants";

const initialState = {
    isLoading: false,
    users: [],
    isError: false
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case userConstants.USERS_LOADING:
            return {
                ...initialState,
                isLoading: true
            }
        case userConstants.USERS_LOADING_SUCCESS:
            return {
                ...state,
                users: action.payload.map(user => ({ id: user._id, name: user.name, tags: user.tags, email: user.email })),
                isLoading: false
            };
        case userConstants.USERS_LOADING_ERROR:
            return {
                users: [],
                isError: true,
                isLoading: false
            }
        default:
            return state;
    }
}

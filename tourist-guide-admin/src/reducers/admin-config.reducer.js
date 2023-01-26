import { adminConstants } from "../constants";

const initialState = {
    isLoading: false,
    tags: [],
    isError: false
}

export function adminConfig(state = initialState, action) {
    switch (action.type) {
        case adminConstants.CONFIG_LOADING:
            return {
                ...initialState,
                isLoading: true
            }
        case adminConstants.CONFIG_TAGS_SUCCESS:
            return {
                ...state,
                tags: action.payload.map(tagObj => ({ text: tagObj.tag, value: tagObj.tag }))
            };
        case adminConstants.CONFIG_FETCH_COMPLETED:
            return {
                ...state,
                isLoading: false
            }
        case adminConstants.CONFIG_FAILURE:
            return {
                tags: [],
                isError: true,
                isLoading: false
            }
        default:
            return state;
    }
}

import { createSelector } from 'reselect';

export const authSelectors = {
    getAuthError: createSelector(
        (state) => state.authentication.isError,
        (error) => error
    ),
    getAdminInfo: createSelector(
        (state) => state.authentication.data || {},
        ({ email, id, name }) => ({ email, id, name })
    ),
    getIsLogedIn: createSelector(
        (state) => state.authentication.data,
        (data) => data ? true : false
    )
}

export const adminConfigSelector = {
    getTags: createSelector(
        (state) => state.adminConfig.tags,
        (tags) => tags
    ),
    getAdminConfigLoading: createSelector(
        (state) => state.adminConfig.isLoading,
        (loading) => loading
    ),
    getAdminConfigError: createSelector(
        (state) => state.adminConfig.isError,
        (error) => error
    )
}

export const addPlaceSelector = {
    getAddPlaceError: createSelector(
        (state) => state.addPlaceReducer.isError,
        (isError) => isError
    )
}

export const placeSelector = {
    getPlaces: createSelector(
        (state) => state.placesReducer.places,
        (places) => places
    ),
    getPlaceLoading: createSelector(
        (state) => state.placesReducer.isLoading,
        (isLoading) => isLoading
    ),
    getPlaceError: createSelector(
        (state) => state.placesReducer.isError,
        (isError) => isError
    )
}

export const userSelector = {
    getUsers: createSelector(
        (state) => state.userReducer.users,
        (users) => users
    ),
    getUserFetchLoading: createSelector(
        (state) => state.userReducer.isLoading,
        (loading) => loading
    ),
    getUserFetchError: createSelector(
        (state) => state.userReducer.isError,
        (error) => error
    )
}
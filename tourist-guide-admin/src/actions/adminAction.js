import { adminConstants } from "../constants";
import { adminService } from "../services";

function loginSuccess(response) {
  return { type: adminConstants.LOGIN_SUCCESS, payload: response };
}

function loginRequest() {
  return { type: adminConstants.LOGIN_REQUEST };
}

function loginFailure(error) {
  return { type: adminConstants.LOGIN_FAILURE, payload: error };
}

function adminProfileUpdateSuccess(updatedInfo) {
  return {
    type: adminConstants.ADMIN_PROFILE_UPDATE_SUCCESS,
    payload: updatedInfo,
  };
}

function adminLogout() {
  return { type: adminConstants.LOGOUT_REQUEST };
}

function getAdminConfigs() {
  return function(dispatch) {
    dispatch({ type: adminConstants.CONFIG_LOADING });
    adminService
      .fetchAdminConfigs()
      .then(function(response) {
        const [tags] = response;
        dispatch({
          type: adminConstants.CONFIG_TAGS_SUCCESS,
          payload: tags.data,
        });
        dispatch({ type: adminConstants.CONFIG_FETCH_COMPLETED });
      })
      .catch(function(error) {
        dispatch({ type: adminConstants.CONFIG_FAILURE, payload: error });
      });
  };
}

export const adminActions = {
  loginSuccess,
  loginRequest,
  loginFailure,
  getAdminConfigs,
  adminProfileUpdateSuccess,
  adminLogout,
};

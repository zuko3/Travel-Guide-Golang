import { axiosFile, axios } from "../helper";
import { apiUrls } from "../constants";

function addPlace(placeedata) {
  return axiosFile().post(apiUrls.ADD_PLACE, placeedata);
}

function updatePlace(placeedata) {
  return axiosFile().post(apiUrls.UPDATE_PLACES, placeedata);
}

function getAllPlace() {
  return axios().get(apiUrls.ALL_PLACES);
}

function deletePlaces(ids) {
  return axios().post(apiUrls.DELETE_PLACES, ids);
}

function addTags(tags) {
  return axios().post(apiUrls.ADD_TAGS, tags);
}
export const placeService = {
  addPlace,
  getAllPlace,
  deletePlaces,
  updatePlace,
  addTags,
};

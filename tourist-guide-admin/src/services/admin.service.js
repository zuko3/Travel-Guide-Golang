import { axios as axiosInstance } from "../helper";
import { apiUrls } from "../constants";
import axios from "axios";

function Login(loginData) {
    return axiosInstance().post(apiUrls.LOGIN_URL, loginData);
}

function fetchTags() {
    return axiosInstance().get(apiUrls.TAGS_URL);
}

function fetchAdminConfigs() {
    return axios.all([fetchTags()])
}

function addUser(user) {
    return axiosInstance().post(apiUrls.ADD_USER, user);
}

function allusers() {
    return axiosInstance().get(apiUrls.ALL_USER)
}

function updateUsers(user) {
    return axiosInstance().post(apiUrls.EDIT_USER, user)
}

function deleteUsers(id) {
    return axiosInstance().post(apiUrls.DELETE_USER, id)
}

function editAdmin(admin) {
    return axiosInstance().post(apiUrls.ADMIN_UPDATE, admin)
}
export const adminService = { Login, fetchAdminConfigs, addUser, allusers, updateUsers, deleteUsers, editAdmin };

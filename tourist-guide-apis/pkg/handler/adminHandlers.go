package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"tourist-guide-apis/pkg/models"
	"tourist-guide-apis/pkg/utility"
)

type AuthenticationSuccessResponse struct {
	Id      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Token   string `json:"token"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type MsgResponse struct {
	Message string `json:"message"`
}

type UserResponse struct {
	Users []models.User `json:"users"`
}

type PlacesResponse struct {
	Places []models.Place `json:"places"`
}

type UserUpdatedResponse struct {
	User    models.User `json:"users"`
	Message string      `json:"message"`
}

func (h handler) HandleAdminLogin(w http.ResponseWriter, r *http.Request) {
	var admin models.Admin
	w.Header().Add("Content-Type", "application/json")
	err := json.NewDecoder(r.Body).Decode(&admin)
	if err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	}
	if result := h.DB.Where("email = ? and Password = ?", admin.Email, admin.Password).First(&admin); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Unauthorized user",
		}
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		if tokenString, tokenError := utility.GenerateJWT(admin.Email, strconv.Itoa(admin.Id)); tokenError != nil {
			errorResponse := ErrorResponse{
				Message: "Internal server error",
			}
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(errorResponse)
		} else {
			successResponse := AuthenticationSuccessResponse{
				Id:      strconv.Itoa(admin.Id),
				Email:   admin.Email,
				Name:    admin.Name,
				Token:   tokenString,
				Message: "Authentication Successfull",
			}
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(successResponse)
		}
	}
}

func (h handler) HandleCreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	w.Header().Add("Content-Type", "application/json")
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	}
	if result := h.DB.Where("email = ?", user.Email).First(&user); result.Error != nil {
		if hashPwd, err := utility.HashPassword(user.Password); err != nil {
			errorResponse := ErrorResponse{
				Message: "Internal server error",
			}
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(errorResponse)
		} else {
			userToSave := models.User{
				Id:       user.Id,
				Name:     user.Name,
				Email:    user.Email,
				Password: hashPwd,
				Tags:     user.Tags,
			}
			if result := h.DB.Create(&userToSave); result.Error != nil {
				errorResponse := ErrorResponse{
					Message: "Internal server error",
				}
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(errorResponse)
			} else {
				successResponse := MsgResponse{
					Message: "User created",
				}
				w.WriteHeader(http.StatusCreated)
				json.NewEncoder(w).Encode(successResponse)
			}
		}
	} else {
		errorResponse := ErrorResponse{
			Message: "User Email already exists",
		}
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(errorResponse)
	}
}

func (h handler) HandleGetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	w.Header().Add("Content-Type", "application/json")
	if result := h.DB.Find(&users); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		userResponse := UserResponse{
			Users: users,
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(userResponse)
	}
}

func (h handler) HandleDeleteUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	w.Header().Add("Content-Type", "application/json")
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	}
	if result := h.DB.Delete(&user, user.Id); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		msgResponse := MsgResponse{
			Message: "user succesfully deleted",
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(msgResponse)
	}
}

func (h handler) HandleEditUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	var decodedUser models.User
	w.Header().Add("Content-Type", "application/json")
	err := json.NewDecoder(r.Body).Decode(&decodedUser)
	if err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	}
	if result := h.DB.First(&user, decodedUser.Id); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "User not found",
		}
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		user.Name = decodedUser.Name
		user.Password = decodedUser.Password
		if result := h.DB.Save(&user); result.Error != nil {
			errorResponse := ErrorResponse{
				Message: "Internal server error",
			}
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(errorResponse)
		} else {
			userUpdatedResponse := UserUpdatedResponse{
				User:    user,
				Message: "user succesfully deleted",
			}
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(userUpdatedResponse)
		}
	}
}

func (h handler) HandleAddPlace(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	if err := r.ParseMultipartForm(10 * 1024 * 1024); err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error image size exceeds",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		files := r.MultipartForm.File["files"]
		filePaths := []string{}
		for _, file := range files {
			// Source
			src, err := file.Open()
			if err != nil {
				fmt.Println(err)
			}
			defer src.Close()
			// Destination
			dst, err := os.CreateTemp("uploads", "upload-*.jpg")
			if err != nil {
				fmt.Println(err)
			}
			defer dst.Close()
			// Copy
			if _, err = io.Copy(dst, src); err != nil {
				fmt.Println(err)
			}
			filePaths = append(filePaths, dst.Name())

		}
		placesToSave := models.Place{
			Name:        r.FormValue("name"),
			Areas:       r.FormValue("areas"),
			Lat:         r.FormValue("lat"),
			Lon:         r.FormValue("lon"),
			Tags:        []string{r.FormValue("tags")},
			Address:     r.FormValue("address"),
			Description: r.FormValue("description"),
			Images:      filePaths,
		}
		if result := h.DB.Create(&placesToSave); result.Error != nil {
			errorResponse := ErrorResponse{
				Message: "Internal server error",
			}
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(errorResponse)
		} else {
			successResponse := MsgResponse{
				Message: "place sucssefully added",
			}
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(successResponse)
		}
	}
}

func (h handler) HandleGetPlaces(w http.ResponseWriter, r *http.Request) {
	var places []models.Place
	w.Header().Add("Content-Type", "application/json")
	if result := h.DB.Find(&places); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		allPlaces := PlacesResponse{
			Places: places,
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(allPlaces)
	}
}

func (h handler) HandleAddTags(w http.ResponseWriter, r *http.Request) {
	var tag models.Tag
	w.Header().Add("Content-Type", "application/json")
	err := json.NewDecoder(r.Body).Decode(&tag)
	if err != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	}
	if result := h.DB.Create(&tag); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		successResponse := MsgResponse{
			Message: "tags added",
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(successResponse)
	}
}

func (h handler) HandleGetTags(w http.ResponseWriter, r *http.Request) {
	var tags []models.Tag
	w.Header().Add("Content-Type", "application/json")
	if result := h.DB.Find(&tags); result.Error != nil {
		errorResponse := ErrorResponse{
			Message: "Internal server error",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(errorResponse)
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(tags)
	}
}

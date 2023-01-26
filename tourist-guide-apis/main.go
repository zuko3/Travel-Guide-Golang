package main

import (
	"log"
	"net/http"
	"tourist-guide-apis/pkg/db"
	"tourist-guide-apis/pkg/handler"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	DB := db.Init()
	h := handler.CreateHandler(DB)

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})

	router := mux.NewRouter()
	fileServer := http.FileServer(http.Dir("./uploads/"))
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", fileServer))

	adminRoutes := router.PathPrefix("/admin").Subrouter().StrictSlash(true)

	adminRoutes.HandleFunc("/login", h.HandleAdminLogin).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/add-user", h.HandleCreateUser).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/all-user", h.HandleGetUsers).Methods(http.MethodGet)
	adminRoutes.HandleFunc("/delete-user", h.HandleDeleteUser).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/edit-user", h.HandleEditUser).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/add-place", h.HandleAddPlace).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/all-place", h.HandleGetPlaces).Methods(http.MethodGet)
	adminRoutes.HandleFunc("/add-tags", h.HandleAddTags).Methods(http.MethodPost)
	adminRoutes.HandleFunc("/tags", h.HandleGetTags).Methods(http.MethodGet)

	log.Println("Server started at 4000.....")
	http.ListenAndServe(":4000", handlers.CORS(headers, methods, origins)(router))
}

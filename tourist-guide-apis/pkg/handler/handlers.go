package handler

import "gorm.io/gorm"

type handler struct {
	DB *gorm.DB
}

func CreateHandler(db *gorm.DB) handler {
	return handler{DB: db}
}

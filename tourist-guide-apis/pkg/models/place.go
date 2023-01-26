package models

import "github.com/lib/pq"

type Place struct {
	Id          int            `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name"`
	Areas       string         `json:"email"`
	Lat         string         `json:"lat"`
	Lon         string         `json:"lon"`
	Tags        pq.StringArray `json:"tags" gorm:"type:text[]"`
	Address     string         `json:"address"`
	Description string         `json:"description"`
	Images      pq.StringArray `json:"images" gorm:"type:text[]"`
}

package models

import "github.com/lib/pq"

type User struct {
	Id       int            `json:"id" gorm:"primaryKey"`
	Name     string         `json:"name"`
	Email    string         `json:"email"`
	Password string         `json:"password"`
	Tags     pq.StringArray `json:"tags" gorm:"type:text[]"`
}

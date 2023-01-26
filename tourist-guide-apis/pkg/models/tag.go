package models

type Tag struct {
	Id  int    `json:"id" gorm:"primaryKey"`
	Tag string `json:"tag"`
}

package db

import (
	"fmt"
	"log"
	"tourist-guide-apis/pkg/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	dbURL := "host=localhost user=postgres password=rahul dbname=TouristAppDb port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Db connected ....")

	db.AutoMigrate(&models.Admin{}, &models.Place{}, &models.Tag{}, &models.User{})
	fmt.Println("Models migration completed ....")
	return db
}

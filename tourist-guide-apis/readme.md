## initialization

go mod init tourist-guide-apis

## Packages

go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
go get -u github.com/gorilla/mux
go get -u github.com/lib/pq
go get -u github.com/golang-jwt/jwt/v4
go get -u github.com/gorilla/handlers

## Learn

https://codewithmukesh.com/blog/jwt-authentication-in-golang/

https://gowebexamples.com/password-hashing/

https://www.thepolyglotdeveloper.com/2017/10/handling-cors-golang-web-application/

https://pkg.go.dev/github.com/rs/cors#section-readme

https://www.codershood.info/2020/02/16/serving-static-files-in-golang-using-gorilla-mux/

strconv.Itoa(123)
strconv.FormatInt(int64(123), 10)

Lon string `json:"lon"`
Tags pq.StringArray `json:"tags" gorm:"type:text[]"`

log.Fatalln(err) -> stops the programs
fmt.Println(result.Error) -> just logs the program

db.Where("name = ? AND age >= ?", "jinzhu", "22").Find(&users)

io.ReadAll(r.Body) vs json.NewDecoder(r.Body).Decode(&admin)

1. var admin models.Admin
   w.Header().Add("Content-Type", "application/json")
   err := json.NewDecoder(r.Body).Decode(&admin)

2. w.Header().Add("Content-Type", "application/json")
   body, err := io.ReadAll(r.Body)
   var admin models.Admin
   json.Unmarshal(body, &admin)

When creating path-based subrouter, you have to obtain it with PathPrefix instead of Path.
r.PathPrefix("/api").Subrouter()
Use r.Path("/api") only when attaching handlers to that endpoint.

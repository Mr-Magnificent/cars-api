## API Documentation as well as requests present in insomnia file

----------------------------------------------------------------------------------
# _API_

# Register
## Body required
```
https://cars-rental-api.herokuapp.com/api/register

@apiBody {String} username - required -- not unique
@apiBody {String} email - required -- has to be unique within db
@apiBody {String} password - required -- minimum 6 charecters
@apiBody {Boolean} isAdmin - required -- is the user created admin -- default false
```
### Note: only admin users can create, update, delete cars

## @Returns
```
200 - user created
400 - User Already registered
422 - missing params
500 - server error
```

## @Successfull example
```
https 200 OK https://cars-rental-api.herokuapp.com/api/register
{
  "message": "User Created",
  "user": {
    "is_admin": true,
    "_id": "5da329a712a3cd26075a54f3",
    "username": "ayush",
    "email": "ayush.zombiestar@gmail.com",
    "password": "$2b$10$I.NK84CbgW31M9Uco2zL9uTLbq2jkYQlUU0xsDPtZLbuWQ65CYftG",
    "__v": 0
  }
}
```

## @Error Example
```
https 400
{
  "message": "User already registered"
}
```

```
https 422
{
  "error": "\"username\" is required"
}
```


# Login
## body requires
```
base_url/api/login

@apiBody {String} email - required -- user email
@apiBody {String} password - required -- user password
```


## @returns
```
status:
200 -- jwt token
401 -- unauthorized with message
400 -- user not found
```
## @Success Examaple
message: API mesg
token: JWT token stored in cookie
```
https 200 https://cars-rental-api.herokuapp.com/api/login
{
  "message": "Successfully logged in",
  "token": "eyJhbGciOiJIUzI1NiJ9.NWRhMzI5YTcxMmEzY2QyNjA3NWE1NGYz.PjKAU1uWTYF5N3LiGNbnM43biKO7pPXQE-9rKUsK3QE"
}
```

## @Error Example
on password missmatch
message: api message
```
https 401 password missmatch
{
  "message": "password mismatch"
}
```

on user not found
message: api message
```
https 400 user not found
{
  "message": "User doesn't exist"
}
```


# Create Booking
## Body required
```
base_url/api/create-booking

@apiBody {String} vin - required -- vehicle identification number -- unique
@apiBody {String} issueDate - required -- booking start (DD-MM-YYYY)
@apiBody {String} returnDate - required -- booking finish (DD-MM-YYYY)
```

## @Returns
```
200 - booking created
422 - invalid issueDate or returnDate or issueDate after returnDate or booking starts in past
404 - car not found for given VIN
422 - Car already booked for given date
500 - internal server error
```

## @Success Example
```
https 200 https://cars-rental-api.herokuapp.com/api/create-booking
{
  "message": "Booking Created",
  "booking": {
    "_id": "5da47e991ff1817955a5a4cb",
    "car_id": "5da458d9403e495233c9ec6a",
    "user_details": "5da329a712a3cd26075a54f3",
    "issue_date": "2019-10-15T18:30:00.000Z",
    "return_date": "2019-10-17T18:29:59.999Z",
    "__v": 0
  }
}
```

## @Error request
```
https 422
{
  "message": "issueDate or returnDate invalid"
}
```
```
https 422
{
  "message": "Car already booked for given dates"
}
```
```
https 404
{
  "message": "Car not found for given VIN"
}
```

# Search By time and City
## Body required
```
base_url/api/search-cars?issueDate=<DD-MM-YYYY>&returnDate=<DD-MM-YYYY>

@apiParam {String} issueDate - required -- start date of search (DD-MM-YYYY)
@apiParam {String} returnDate - required -- end date of search (DD-MM-YYYY)
@apiParam {String} city - Optional -- city to search within
```

## @Returns
```
200 - ok success
422 - issueDate or returnDate invalid or issueDate greater than returnDate
500 - internal server error
```

## @Sucess Example
```
https 200 http://localhost:3000/api/search-cars?issueDate=11-10-19&returnDate=11-10-19
{
  "cars": [
    {
      "bookings": [
        "5da4595b5732835458c078ce"
      ],
      "_id": "5da458d9403e495233c9ec6a",
      "vin": "1D7GL46X73S24675",
      "city": "banglore",
      "model": "wagonr",
      "seat_capacity": 4,
      "rent_per_day": 960,
      "__v": 1
    },
    {
      "bookings": [
        "5da471ecf3c77a711fcfaa5a"
      ],
      "_id": "5da471e8f3c77a711fcfaa59",
      "vin": "1D7GL46X73S24676",
      "city": "banglore",
      "model": "wagonr",
      "seat_capacity": 4,
      "rent_per_day": 960,
      "__v": 1
    }
  ]
}
```

## @Error Example
```
https 422 http://localhost:3000/api/search-cars?issueDate=11-10-19
{
  "message": "issueDate or returnDate invalid"
}
```

# Search by car model
## Query required
```
base_url/api/search-by-model?model=wagonr

@apiParam {String} model - required -- model of car searched
```

## @Returns
```
200 - Car with the given model
400 - model not provided
500 - internal server error
```

## @Sucess Result

Bookings[]: bookings for that car

Cars: Cars with the queried model
```
https 200 https://cars-rental-api.herokuapp.com/api/search-by-model?model=wagonr
{
  "cars": [
    {
      "bookings": [
        {
          "_id": "5da4595b5732835458c078ce",
          "car_id": "5da458d9403e495233c9ec6a",
          "user_details": "5da329a712a3cd26075a54f3",
          "issue_date": "2019-10-13T18:30:00.000Z",
          "return_date": "2019-10-13T18:30:00.000Z",
          "__v": 0
        }
      ],
      "_id": "5da458d9403e495233c9ec6a",
      "vin": "1D7GL46X73S24675",
      "city": "banglore",
      "model": "wagonr",
      "seat_capacity": 4,
      "rent_per_day": 960,
      "__v": 1
    },
    {
      "bookings": [
        {
          "_id": "5da459a620399e54c41b4d7e",
          "car_id": "5da4590821992453ebe594c8",
          "user_details": "5da329a712a3cd26075a54f3",
          "issue_date": "2019-10-13T18:30:00.000Z",
          "return_date": "2019-10-13T18:30:00.000Z",
          "__v": 0
        }
      ],
      "_id": "5da4590821992453ebe594c8",
      "vin": "1D7GL46X73S24676",
      "city": "banglore",
      "model": "wagonr",
      "seat_capacity": 4,
      "rent_per_day": 960,
      "__v": 1
    }
  ]
}
```

## @Error Example
```
https 400 Bad request
{
  "message": "Model not provided"
}
```

# Delete Car

## Query Required
```
base_url/api/delete-car?vin=1D7GL46X73S24677

@apiParam {String} vin - required -- deleted vehicle id
```

## @Returns
```
200 - delted, returns deleted data
400 - VIN not found
422 - Car has active bookings, cannot be deleted / no such car
500 - internal server error
```

## @Succesful Example
```
https 200 https://cars-rental-api.herokuapp.com/api/delete-car?vin=1D7GL46X73S24677
{
  "message": "Car removed",
  "car": {
    "bookings": [],
    "_id": "5da47387f3c77a711fcfaa5d",
    "vin": "1D7GL46X73S24677",
    "city": "banglore",
    "model": "wagonr",
    "seat_capacity": 4,
    "rent_per_day": 960,
    "__v": 0
  },
  "bookings": {
    "message": "deleted associated bookings with car",
    "deleted": {
      "n": 0,
      "ok": 1,
      "deletedCount": 0
    }
  }
}
```
## @Error example
```
https 422 unprocessable entry
{
  "message": "The car cannot be deleted because of active bookings"
}
```
```
https 400 bad request
{
  "message": "vehicle identification number (VIN) required"
}
```

# Update Car
## Body Required
```
base_url/api/update-car

@apiBody {String} vin - required -- update vehicle id
@apiBody {String} city - optional -- updated city
@apiBody {String} seatCapacity - opt - updated seat_capacity
@apiBody {Number} rentPerDay - opt - updated rent per day
@apiBody {String} model - opt --updated car model
```

## @Returns
```
200 - delted, returns deleted data
400 - VIN not found
422 - Car has active bookings, cannot be updated / no such car
500 - internal server error
```

## @Sucess Example
```
https 200 https://cars-rental-api.herokuapp.com/api/update-car
{
  "message": "Car updated",
  "updated": {
    "n": 1,
    "nModified": 1,
    "ok": 1
  }
}
```

## @Error example
```
https 400
{
  "message": "vehicle identification number (VIN) required"
}
```

# Create Car
## Body required
```
base_url/api/add-car

@apiBody {String} vin - required -- vehicle identification number -- unique
@apiBody {String} city - required -- city of the car
@apiBody {String} model - required -- model of car
@apiBody {Number} seatCapacity - capacity of car
@apiBody {Number} rentPerDay - rent of car for each day
```

# @Returns
```
200 - car added
403 - user is not admin
422 - missing parameters
500 - internal server error
```

## @Success Example
vin: vehicle identification number

city: city of car

model: model of car

seat_capacity: capacity of car

rent_per_day: rent of car in rupees

bookings: active booking of the car
```
https 200 https://cars-rental-api.herokuapp.com/api/add-car
{
  "message": "Car has been added",
  "car": {
    "bookings": [],
    "_id": "5da329d456e1522681fc3197",
    "vin": "1D7GL46X73S324675",
    "city": "banglore",
    "model": "wagonr",
    "seat_capacity": 4,
    "rent_per_day": 600,
    "__v": 0
  }
}
```

## @Error example
```
https 422 Unprocessable entity
{
  "error": "\"VIN\" is required"
}
```
```
https 403 Forbidden
{
  "message": "User is not admin"
}
```

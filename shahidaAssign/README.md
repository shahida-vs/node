endpoints : 

Auth - 
- POST /store/auth  for logging in



User -
- GET /store/users/  (for admin all users are resulted, for other users , only their own credentials are resulted)
- POST /store/users/ for registering new user




Movie - 

Pagination implemented for GET. each page will have 2 records
- GET /store/movies/<page No.> results movies on the passed page no. in params
- GET /store/movies/movie/<movieId> results in one particular movie with given movieId
- POST /store/movies to add a particular movie
- PUT /store/movies/movie/<movieId> to update a particular movie with given movieId
- DELETE /store/movies/movie/<movieId> to delete a particular movie with given movieId

NOTE : Deleting a movie will not be allowed unless all records of the movie from rental are deleted.
       Addition or modification of currently available field in movie can not be done, it is updated automatically.
       movieId can not be modified since it is used in rental and modifying it would require modifying all the 
          records that exist in rental, with that id. 
       If page no is not passed in GET then,  movies on first page are resulted (GET /store/movies).
       





Customer - 

Pagination implemented for GET. each page will have 2 records
- GET /store/customers/<page No.> results customers on the passed page no. in params
- GET /store/customers/customer/<customerId> results in one particular customer with given customerId
- POST /store/customers to add a particular customer
- PUT /store/customers/customer/<customerId> to update a particular customer with given customerId
- DELETE /store/customers/customer/<customerId> to delete a particular customer with given customerId

NOTE : Deleting a customer will not be allowed unless all records of the customer from rental are deleted.
       customerId can not be modified since it is used in rental and modifying it would require modifying all the   
           records that exist in rental, with that id.
       If page no is not passed in GET then,  customers on first page are resulted (GET /store/customers).
         
       





Rental - 

Pagination implemented for GET /store/rental endpoint only. each page will have 2 records
- GET /store/rental/<page> results rental details on the passed page no. in params
- GET /store/rental/rent/<rentId> results in one particular rent details with given rentId
- GET /store/rental/current results in record of all rented out movies
- GET /store/rental/customer/<customerId>results in all rental records of customer with customerId
- GET /store/rental/movie/<movieId> results in all rental records of a movie with given movieId
- POST /store/rental to add a particular record when customer rents a movie
- PUT /store/rental/rent/<customerId> to update a particular record when customer returns a movie
- DELETE /store/rental/customer/<customerId> to delete all records of customer with given customerId
- DELETE /store/rental/movie/<movieId> to delete all records of movie with given movieId



NOTE : HARD delete implemented, since no point in keeping long records of movie which the admin wishes to delete.
       If page no is not passed in GET then,  records on first page are resulted (GET /store/rental).
       Only customerId and movieId are to be passed when adding a new record(i.e., when renting a movie),dateOut is   
           automatically updated.
       Only damageCharges can be passed in modification & it is optional to pass.
       rentalFee and totalCharges are calculated & updated during modification, and dateReturned is updated 
           automatically during modification.
       When customer rents a movie(addition of a record to rental), currentlyAvailable reduces by 1 in Movie table.
       When customer returns a movie(modification of a record in rental),currentlyAvailable increases by 1 in Movie   
           table.
       customerId and movieId should exist in respective tables if customer wants to rent a movie.
       
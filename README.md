# Bookstore Backend API Documentation

## Introduction
This documentation provides an overview of the API for the Bookstore application. It covers the available endpoints, request/response formats, and error codes.

## Live Url
All API is live in : `https://bookstore-nestjs.vercel.app/`

## Base URL
All API requests are made to: `http://localhost:3000/`

## Endpoints

### Books

- `GET /books`: Retrieves a list of all books in the bookstore.
  - Request: No parameters
  - Response: An array of book objects
  - Example: `GET /books`

- `GET /books/{id}`: Retrieves a specific book by its ID.
  - Request: `id` (path parameter)
  - Response: A book object
  - Example: `GET /books/1`

- `POST /books`: Creates a new book in the bookstore.
  - Request: A JSON object containing `title`, `author`, `price`, and `tags`
  - Response: The created book object
  - Example: `POST /books` with `{ "title": "New Book", "author": "Author Name", "price": 19.99, "tags": ["fiction", "science"] }`

- `PUT /books/{id}`: Updates an existing book.
  - Request: `id` (path parameter) and a JSON object containing the fields to update
  - Response: The updated book object
  - Example: `PUT /books/1` with `{ "price": 9.99 }`

- `DELETE /books/{id}`: Deletes a book from the bookstore.
  - Request: `id` (path parameter)
  - Response: A message indicating the result of the operation
  - Example: `DELETE /books/1`

### Users

- `POST /login`: Logs in a user.
  - Request: A JSON object containing `username` and `password`
  - Response: A JSON object containing the access token

- `GET /customers/me`: Retrieves the current user's information.
  - Request: No parameters, but requires a bearer token for authentication
  - Response: A JSON object containing the user's information

- `DELETE /logout`: Logs out a user.
  - Request: No parameters, but requires a bearer token for authentication
  - Response: A JSON object containing the access token

- `POST /signup`: Signs up a new user.
  - Request: A JSON object containing `username` and `password`
  - Response: A JSON object containing the user's information

### Customers

- `POST /customers/`: Creates a new customer.
  - Request: A JSON object containing `name` and `points`, and requires a bearer token for authentication
  - Response: A JSON object containing the created customer's information

- `GET /customers/`: Retrieves a list of all customers.
  - Request: No parameters, but requires a bearer token for authentication
  - Response: A JSON array containing the list of customers

### Orders

- `POST /orders`: Creates a new order.
  - Request: A JSON object containing `customerId`, `bookId`, and `quantity`, and requires a bearer token for authentication
  - Response: A JSON object containing the created order's information

- `GET /orders`: Retrieves a list of all orders.
  - Request: No parameters, but requires a bearer token for authentication
  - Response: A JSON array containing the list of orders

- `GET /orders/{id}`: Retrieves a specific order by its ID.
  - Request: `id` (path parameter), and requires a bearer token for authentication
  - Response: A JSON object containing the order's information

## Error Codes
- `400 Bad Request`: The request was invalid or cannot be served. The exact error should be explained in the error payload. E.g. "`title` is missing."
- `401 Unauthorized`: The request requires user authentication.
- `403 Forbidden`: The server understood the request, but it refuses to authorize it.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An error occurred in the server.

## Rate Limiting
The API has a rate limit of 1000 requests per hour. If the limit is exceeded, the server will respond with a `429 Too Many Requests` status code.

## Authentication
Some endpoints require authentication. This is done via a bearer token sent in the `Authorization` header. E.g. `Authorization: Bearer your-token-here`
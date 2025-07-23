# CRICSTORE AUTH SERVICE

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Store Routes](#store-routes)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Project Overview

This project is a TypeScript-based authentication and user management service built with **Node.js** and **Express**. It provides functionalities for user registration, login, authentication, and management, along with store management. The service uses a **PostgreSQL** database with **TypeORM** for data persistence, **JWT** for authentication, and includes features like **role-based access control**.

---

## Features

-   **User Authentication:** Secure user registration and login with JWT-based authentication.
-   **Role-Based Access Control:** Differentiated access levels for Admin, Manager, and Customer roles.
-   **User Management:** Complete CRUD operations for user management, accessible to admins.
-   **Store Management:** Functionalities for creating, updating, and deleting stores.
-   **Token Management:** Uses access and refresh tokens for authentication, with refresh tokens stored in the database.
-   **Database Migrations:** Manages database schema changes using TypeORM migrations.

---

## Getting Started

### Prerequisites

-   Node.js (v22.14.0)
-   PostgreSQL database
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adarsh-naik-2004/bats-auth_service.git
    cd bats-auth_service
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

1.  **Environment Variables:** Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a template.
    ```
    PORT=...
    NODE_ENV=...
    DB_HOST=...
    DB_PORT=...
    DB_USERNAME=...
    DB_PASSWORD=...
    DB_NAME=...
    REFRESH_TOKEN_SECRET=...
    JWKS_URI=...
    PRIVATE_KEY=...
    ADMIN_UI_DOMAIN=...
    CLIENT_UI_DOMAIN=...
    MAIN_DOMAIN=...
    ```
2.  **Generate RSA Keys:** Generate private and public keys for JWT signing:
    ```bash
    npm run generate:keys
    ```

### Running the application

1.  **Run database migrations:**
    ```bash
    npm run migration:run
    ```
2.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be running on the port specified in your `.env` file.

---

## API Documentation

### Auth Routes

-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Log in a user.
-   `GET /auth/self`: Get the currently authenticated user's information.
-   `POST /auth/refresh`: Refresh the access token.
-   `POST /auth/logout`: Log out a user.

### User Routes

-   `POST /users`: Create a new user (Admin only).
-   `PATCH /users/:id`: Update a user (Admin only).
-   `GET /users`: Get a list of all users (Admin only).
-   `GET /users/:id`: Get a single user by ID (Admin only).
-   `DELETE /users/:id`: Delete a user (Admin only).

### Store Routes

-   `POST /stores`: Create a new store (Admin only).
-   `PATCH /stores/:id`: Update a store (Admin only).
-   `GET /stores`: Get a list of all stores.
-   `GET /stores/:id`: Get a single store by ID (Admin only).
-   `DELETE /stores/:id`: Delete a store (Admin only).

---

## Project Structure

The project follows a standard structure for Node.js applications, with clear separation of concerns:

-   `src/`: Contains the main source code.
    -   `controllers/`: Handles incoming requests and sends responses.
    -   `services/`: Contains the business logic of the application.
    -   `entity/`: Defines the database models using TypeORM.
    -   `routes/`: Defines the API routes.
    -   `config/`: Includes configuration files for the database, logger, etc.
    -   `middlewares/`: Contains middleware functions for handling requests.
    -   `validators/`: Includes validation schemas for request data.
-   `tests/`: Contains all the tests for the application.
-   `docker/`: Includes Dockerfiles for development and production environments.

---

## Testing

The project uses **Jest** for testing. To run the tests, use the following command:

```bash
npm test
```

## Deployment
The project includes Docker configurations for easy deployment. The production Dockerfile creates a lean, optimized image for deployment. You can build and run the Docker container using the following commands:
```bash
docker build -t auth-service .
docker run -p <port>:<port> auth-service
```

# Sistem Informasi Rumah Sakit X Sistem Donor Darah

Aplikasi REST API yang dibentuk menggunakan Express.js, Node.js, and PostgreSQL untuk memfasilitasi interoperabilitas antara Sistem Informasi Rumah Sakit dan Sistem Donor Darah.

## 📋 Table of Contents

- [API Documentation](#api-documentation)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [License](#license)

## 📚 API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```
## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Documentation**: Swagger UI
- **Development**: Nodemon (hot reloading)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12.x or higher)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/your-app-name.git
cd your-app-name
```

2. **Install dependencies**

```bash
npm install
```

3. **Install additional libraries**

```bash
# Development dependencies
npm install --save-dev nodemon

# Runtime dependencies
npm install dotenv cors pg jsonwebtoken bcrypt swagger-ui-express swagger-jsdoc
```

## ⚙️ Configuration

1. **Create a `.env` file in the project root with the following variables:**

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

## 🏃‍♂️ Running the App

### Development mode

```bash
# Using nodemon for hot reloading
npm run dev
```

### Production mode

```bash
npm start
```
## 📁 Project Structure

```
.
├── components/         # Token Handle etc
├── routes/             # API routes
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── app.js              # Application entry point
├── database.js         # Database setup
├── database.sql        # Database sql files for import
├── swagger.js          # Swagger Docs setup
├── package.json        # Project metadata and dependencies
├── package-lock.json   # Project dependencies
└── README.md           # Project documentation
```

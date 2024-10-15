# Backend API

This repository contains the backend code for the Learnium application, built using Node.js and Express.js. The backend serves as the API layer, handling client requests, managing data, and providing a RESTful interface for various operations.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Features
- Integration with databases like MongoDB.
- Integrated Firebase Genkit AI for integration gen ai into project.

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **Database**: MongoDB
- **Firebase Genkit**: Integration of gen Ai.
- **dotenv**: Environment variable management.

## Installation

Follow these steps to set up the project locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
   
2. **Run project**:
   ```bash
   npm run dev
   ```
   
3. **Build project**:
   ```bash
   npm run build
   ```
## Environment Variables
Make sure to set the following environment variables in your .env file:
```
PORT= YOUR_PORT_NO
DATABASE_URL=your-database-connection-string
GOOGLE_AI_API_KEY=your-secret-key
```

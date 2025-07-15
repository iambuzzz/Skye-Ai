# Skye-Ai

## Overview

Skye-Ai is a web application featuring an AI chatbot powered by Google's Gemini (and potentially OpenAI). Users can interact with the chatbot to generate text-based responses. The application has a separate frontend built with React and Vite, and a backend built with Node.js and Express.js, utilizing MongoDB for data storage and user authentication. The deployment of this application was configured for Render.

## Tech Stack

### Frontend

* **React:** JavaScript library for building user interfaces.
* **Vite:** A build tool that provides a fast and efficient development experience for modern web projects.
* **React Router DOM:** For handling routing within the single-page application.
* **Axios:** A promise-based HTTP client for making API requests to the backend.

### Backend

* **Node.js:** JavaScript runtime environment.
* **Express.js:** A minimal and flexible Node.js web application framework.
* **MongoDB:** NoSQL database for storing user data and chat history.
* **Mongoose:** MongoDB object modeling tool designed to work in an asynchronous environment.
* **bcrypt:** For hashing and comparing passwords securely.
* **jsonwebtoken (JWT):** For creating and verifying user authentication tokens.
* **cookie-parser:** Express middleware for parsing cookies.
* **cors:** Middleware to enable Cross-Origin Resource Sharing.
* **dotenv:** To load environment variables from a `.env` file.
* **@google/genai:** Google Gemini API client library.

## Screenshots

| Homepage (Style 1)                         | Homepage (Style 2)                         |
| :--------------------------------------- | :--------------------------------------- |
| ![Homepage 1](path/to/home1.png) | ![Homepage 2](path/to/home2.png) |
| **Sign In Page** | **Sign Up Page** |
| ![Sign In Page](path/to/signin.png)       | ![Sign Up Page](path/to/signup.png)       |
| **Chat Interface (Example 1)** | **Chat Interface (Example 2)** |
| ![Chat Example 1](path/to/chat1.png)     | ![Chat Example 2](path/to/chat2.png)     |

## Deployment (Render)

This project is designed to be deployed on Render, with separate services for the frontend (as a Static Site) and the backend (as a Web Service).

### Backend Deployment

1.  **Create a new "Web Service" on Render.**
2.  **Connect your Skye-Ai GitHub repository.**
3.  **Set the following configuration:**
    * **Service Name:** `skye-ai-backend` (or your preferred name)
    * **Region:** Choose a region.
    * **Branch:** `main` (or your main branch)
    * **Root Directory:** `Backend/`
    * **Runtime:** Node (auto-detected)
    * **Build Command:** `npm install && npm run build`
    * **Start Command:** `npm start`
    * **Environment Variables:** Add the following (replace with your actual values):
        * `PORT`: `10000` (or any other port - ensure your backend code uses `process.env.PORT`)
        * `MONGO_URI`: Your MongoDB Atlas connection string.
        * `JWT_SECRET`: A long, random string for JWT signing.
        * `COOKIE_SECRET`: A long, random string for cookie signing.
        * `GEN_AI_SECRET`: Your Google Gemini API key.
        * `OPEN_AI_SECRET`: Your OpenAI API key (if used).
        * `OPENAI_ORGANISATION_ID`: Your OpenAI organization ID (if used).
        * `CORS_ORIGIN`: `https://skye-ai-frontend.onrender.com,http://localhost:5173` (Add your frontend's Render URL and local development URL)
        * `NODE_ENV`: `production`
        * `COOKIE_DOMAIN`: `.onrender.com`
    * **Plan:** Choose your desired plan (Free is available for testing).
4.  **Click "Create Web Service".** Monitor the logs for successful deployment.

### Frontend Deployment

1.  **Create a new "Static Site" on Render.**
2.  **Connect your Skye-Ai GitHub repository.**
3.  **Set the following configuration:**
    * **Service Name:** `skye-ai-frontend` (or your preferred name)
    * **Region:** **Crucially, select the same region as your backend service.**
    * **Branch:** `main` (or your main branch)
    * **Root Directory:** `Frontend/`
    * **Build Command:** `npm install && npm run build`
    * **Publish Directory:** `dist`
    * **Rewrites/Redirects:** Add a rule:
        * **Source:** `/`
        * **Destination:** `/index.html`
        * **Status Code:** `200`
    * **Environment Variables:** Add the following (replace with your backend's actual Render URL):
        * `VITE_BACKEND_URL`: `https://skye-ai-backend.onrender.com/api/v1`
    * **Plan:** Choose your desired plan (Free is available for testing).
4.  **Click "Create Static Site".** Monitor the logs for successful deployment.

## Local Development

1.  **Clone the repository:** `git clone <repository-url>`
2.  **Navigate to the backend:** `cd Backend`
3.  **Install backend dependencies:** `npm install`
4.  **Create a `.env` file** in the `Backend` directory and add the necessary environment variables (similar to the Render setup, but you can use `http://localhost:5000/api/v1` for `VITE_BACKEND_URL` and `localhost` for `COOKIE_DOMAIN`).
5.  **Run the backend:** `npm run dev`
6.  **Navigate to the frontend:** `cd ../Frontend`
7.  **Install frontend dependencies:** `npm install`
8.  **Create a `.env` file** in the `Frontend` directory and add `VITE_BACKEND_URL=http://localhost:5000/api/v1`.
9.  **Run the frontend:** `npm run dev`
10. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Key Features

* **AI Chatbot:** Interact with an AI powered by Google Gemini to receive text-based responses.
* **User Authentication:** Users can sign up and log in to the application.
* **Chat History:** User chat history is stored in the database.

## Troubleshooting

* **401 Unauthorized Errors After Deployment:** This is often due to incorrect cookie domain settings in the backend. Ensure the `COOKIE_DOMAIN` environment variable on Render is set to `.onrender.com` and your backend code dynamically sets the cookie domain based on the environment. Also, ensure the `secure` and `sameSite: "none"` flags are correctly set for cookies in production. Verify that your frontend is sending credentials with API requests (`withCredentials: true` in Axios).
* **CORS Issues:** Ensure your backend's `CORS_ORIGIN` environment variable includes your frontend's Render URL and local development URL.
* **Backend Not Connecting to MongoDB:** Double-check your `MONGO_URI` environment variable on Render and ensure your MongoDB Atlas cluster allows connections from "Anywhere" or the specific IP addresses of Render.
* **Frontend Not Connecting to Backend:** Verify the `VITE_BACKEND_URL` environment variable in your frontend's Render settings points to the correct live URL of your deployed backend service (including `/api/v1`).

---

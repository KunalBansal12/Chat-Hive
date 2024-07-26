# Chat Hive

Chat Hive is a real-time chat application that utilizes WebSockets to provide seamless and instant messaging. The app is designed to offer a user-friendly experience with various features including image and video sharing, profile customization, and secure authentication. Currently, the app is in development, and the team is working on integrating end-to-end encryption for messages.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time messaging with WebSockets
- User registration and authentication via email and OTP verification
- Password reset via OTP verification
- Profile customization (upload/change display picture and name)
- Secure storage of images and videos using Cloudinary
- Password hashing with bcryptjs
- JWT for secure token-based authentication
- State management with Recoil
- Currently developing end-to-end encryption for messages

## Tech Stack

### Frontend

- React
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB (using Mongoose)
- WebSockets

### Libraries and Tools

- JWT (jsonwebtoken)
- bcryptjs
- Cloudinary
- Recoil
- mongoose
- cookie-parser

## Installation

### Prerequisites

- Node.js
- npm (or yarn)
- MongoDB

### Backend Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/KunalBansal12/Chat-Hive.git
    cd Chat-Hive
    ```

2. Install backend dependencies:

    ```sh
    cd backend
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the `backend` directory and add the following:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the backend server:

    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```sh
    cd ../frontend
    ```

2. Install frontend dependencies:

    ```sh
    npm install
    ```

3. Start the frontend development server:

    ```sh
    npm start
    ```

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Register a new account or log in with an existing account.
3. Start chatting in real-time, share images and videos, and customize your profile.

## Project Structure

    Chat-Hive/
    ├── backend/
    │ ├── controllers/
    │ │ ├── authController.js
    │ │ ├── chatController.js
    │ │ └── userController.js
    │ ├── models/
    │ │ ├── Message.js
    │ │ ├── User.js
    │ │ └── index.js
    │ ├── routes/
    │ │ ├── authRoutes.js
    │ │ ├── chatRoutes.js
    │ │ └── userRoutes.js
    │ ├── utils/
    │ │ ├── auth.js
    │ │ ├── db.js
    │ │ └── upload.js
    │ ├── .env
    │ ├── server.js
    │ └── ...
    ├── frontend/
    │ ├── src/
    │ │ ├── components/
    │ │ │ ├── Avatar.js
    │ │ │ ├── ChatBox.js
    │ │ │ ├── Divider.js
    │ │ │ ├── Message.js
    │ │ │ ├── Navbar.js
    │ │ │ └── ...
    │ │ ├── recoil/
    │ │ │ ├── atoms.js
    │ │ │ └── selectors.js
    │ │ ├── pages/
    │ │ │ ├── ChatPage.js
    │ │ │ ├── HomePage.js
    │ │ │ ├── LoginPage.js
    │ │ │ ├── ProfilePage.js
    │ │ │ └── RegisterPage.js
    │ │ ├── App.js
    │ │ ├── index.js
    │ │ └── ...
    │ ├── public/
    │ │ ├── index.html
    │ │ └── ...
    │ └── ...
    ├── README.md
    └── ...


## Contributing

We welcome contributions to improve Chat Hive. Here’s how you can help:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

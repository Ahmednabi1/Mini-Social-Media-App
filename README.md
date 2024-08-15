# Mini Social Media App

Welcome to the Mini Social Media App! This project is a Node.js web application that implements a simple social media platform with features such as user authentication, profile management, CRUD operations, and more. It leverages Express for server-side functionality, EJS for templating, and Sequelize for database interactions.

## Features

- **User Authentication**: Register, log in, and manage user sessions securely.
- **Profile Management**: View and update user profile information.
- **CRUD Operations**: Create, read, update, and delete posts and comments.
- **Database Relationships**: Utilize Sequelize ORM for managing relationships between users, posts, and comments.
- **Pagination**: Navigate through posts and comments with pagination.
- **Error Handling**: User-friendly error messages and input validation.

## Installation

To get started with this project, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Ahmednabi1/Mini-Social-Media-App.git
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd Mini-Social-Media-App
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Set Up Environment Variables**:
    - Create a `.env` file in the root directory of the project.
    - Add the following environment variables:
      ```plaintext
      DATABASE_URL=your_database_url
      SESSION_SECRET=your_session_secret
      ```

5. **Run Database Migrations**:
    - Ensure your database is set up.
    - Run the migrations to create the necessary tables:
      ```bash
      npx sequelize-cli db:migrate
      ```

6. **Start the Application**:
    ```bash
    npm start
    ```
    The app will be running at `http://localhost:3000`.

## Usage

- **Registration**: Create a new user account via the registration page.
- **Login**: Access the platform using your registered credentials.
- **Profile**: View and update your profile information.
- **Posts**: Create, view, edit, and delete posts.
- **Comments**: Add, edit, and remove comments on posts.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and improvements are welcome!

## License

This project is licensed under the MIT License.

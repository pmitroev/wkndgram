# Wkndgram

**Wkndgram** is a social media platform for sharing photos and videos from concerts and events, inspired by Twitter’s feed layout. Users can sign up, post their experiences, like other users' posts, and view their own posts on their profile page.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Key Components](#key-components)
6. [Authentication](#authentication)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- **User Authentication**: Sign up, log in, and log out with email and password.
- **Feed**: View posts (photos, videos) shared by other users in a Twitter-like feed layout.
- **Create Posts**: Users can create posts with a description and an optional image.
- **Like/Unlike Posts**: Users can like and unlike posts, and the like count updates in real-time.
- **Profile Page**: Users can view their own posts on their profile page.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**:
  - React
  - Next.js (using App Router)
  - TypeScript
  - Tailwind CSS for styling
  - Material-UI (for icons and UI components)
- **Backend**:
  - Supabase (Database and Authentication)
  - PostgreSQL (Database)

## Project Structure

```bash
.
├── app
│   ├── auth
│   │   └── confirm
│   │       └── route.ts
│   ├── context
│   │   └── AuthContext.tsx
│   ├── create-post
│   │   └── page.tsx
│   ├── error
│   │   └── page.tsx
│   ├── feed
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── page.tsx
│   ├── profile
│   │   └── page.tsx
│   └── signup
│       └── page.tsx
├── components
│   ├── CreatePost.tsx
│   ├── CreatePostButton.tsx
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   └── PostCardPreview.tsx
├── middleware.ts
└── utils
    └── supabase
        ├── client.ts
```

## Database Schema

### Users Table

| Column   | Type | Description     |
| -------- | ---- | --------------- |
| id       | UUID | Primary key     |
| username | TEXT | Unique username |
| email    | TEXT | User's email    |

### Posts Table

| Column      | Type      | Description                   |
| ----------- | --------- | ----------------------------- |
| id          | UUID      | Primary key                   |
| description | TEXT      | Post description              |
| imageUrl    | TEXT      | URL to the image              |
| likes       | INTEGER   | Number of likes               |
| user_id     | UUID      | Foreign key to the user table |
| username    | TEXT      | Username of the post creator  |
| created_at  | TIMESTAMP | Date of creation              |

### Likes Table

| Column  | Type | Description                    |
| ------- | ---- | ------------------------------ |
| id      | UUID | Primary key                    |
| post_id | UUID | Foreign key to the posts table |
| user_id | UUID | Foreign key to the users table |

### Database Policies

- Ensure row-level security is enabled for all tables.
- Allow `INSERT` and `DELETE` operations on the `likes` table based on the user authentication status.

## Key Components

### Navbar

- The navigation bar appears on every page (except login and signup).
- It contains links to the feed and profile and shows the username if logged in.

### PostCard

- This component is used to display posts on the feed and profile pages.
- Includes a description, image, and like button.

### Create Post Button

- A floating button at the bottom right of the screen, which takes users to the "Create Post" page.

## Authentication

- **Sign Up**: Users sign up with an email and password.
- **Login**: Users can log in to their account.
- **Session Management**: The authentication context (`AuthContext`) handles user session state across the app.

## Contributing

Feel free to fork the project, submit issues, and make pull requests. Contributions are highly appreciated!

## License

This project is licensed under the MIT License.

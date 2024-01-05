
# Speer Backend Asessment

This is a secure and scalable RESTful API that allows users to create, read, update, and delete notes. The application also allow users to share their notes with other users and search for notes based on keywords.


## Tech Stack

**Server:** Node, Express, TypeScript

**Database:** PostgreSQL

**ORM:** Prisma

**Authentication Protocol:** JSON Web Token
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL` for example `postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public`

`JWT_SECRET` for example `password` 😁 _never use it as secret_


## Run Locally

Clone the project

```bash
  git clone https://github.com/Codensity30/speer-backend-assessments.git
```

Go to the project directory

```bash
  cd speer-backend-assessments
```

Initialize project - this will install all dependencies and initialize prisma

```bash
  npm run initialize
```

Start the server - this will start server at port 8000

```bash
  npm run start
```


## API Reference

### Authorization routes

- #### Sign Up - To sign up the user.

```http
  POST /api/auth/signup
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email |
| `password` | `string` | **Required**. Password |

- #### Log In - To log in the user returns `JWT` token

```http
  POST /api/auth/login
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. Email |
| `password` | `string` | **Required**. Password |

### Note routes

In all routes of this section there must be `Authorization` header. 

Example - 
`Authorization` : `Bearer token` note Bearer and token is seprated with space.

- #### Creates the note with user as author

```http
  POST /api/notes/create
```
| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title` | `string` | **Required**. Title |
| `content` | `string` | **Required**. Content |

- #### Returns all the created and shared notes of the user

```http
  GET /api/notes/
```
- #### Share the note with another user

```http
  GET /api/notes/:noteId/share/:userId
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `noteId` | `string` | **Required**. Note Id |
| `userId` | `string` | **Required**. User Id to be shared with |

#### Note ID  specific routes:

- Return the specific note
```http
  GET /api/notes/:id
```
- Updates the specific note
```http
  PUT /api/notes/:id
```
- Deletes the specific note
```http
  DELETE /api/notes/:id
```

NOTE - _All the above route can only be acessed if the user is the author of this note_

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id` | `string` | **Required**. Note Id |

### Search routes

- #### Search the query within the notes

```http
  GET /api/search?q
```
| Query | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q` | `string` | **Required**. Query |
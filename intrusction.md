# Step-by-Step Tasks

## Phase 1 — Minimal server & ping

- Create server.ts and import Express
- Start the server on PORT 3000
- Add GET /ping returning { message: 'pong' }

## Phase 2 — Fetch random person

- Create GET /random-person route
- Use fetch to get data from https://randomuser.me/api/
- Validate the response with Zod
- Return full name and country (instead of email)

## Phase 3 — User POST route

- Create POST /users route
- Accept an object with name, age, and email
- Validate using Zod with rules:
  - name: 3-12 characters
  - age: optional, 18-100, default 28
  - email: must be valid and lowercase

- Return 201 with the validated user or 400 with error details

## Challenge — Fetch additional data

- Create GET /random-login route
- Fetch a random user from the RandomUser API
- Return their username and registered date
- Validate the response with Zod to ensure the fields exist
- Optional: Display in the response a short summary like: 'username (registered on YYYY-MM-DD)'

**Considering assignment steps**

The user wants a step-by-step guide for the assignment, but without any code. I need to remember that and focus on providing conceptual steps. I'll break it down into phases like setup, server, routes, and Zod schemas, but without any code snippets or backticks. I’ll keep it concise but clear, making sure to acknowledge their preference for no code. This way, I can give them the structure they need without overwhelming them with technical details.
Got it—that’s a really clear preference. I’ll stick to concepts and steps only, no code, unless you explicitly ask for it.

Here’s a code-free, step-by-step plan for your assignment.

---

### Phase 0 – Project and tooling setup

1. Initialize a new Node project so you get a package manifest.
2. Install runtime dependencies:
   - Express for the HTTP server.
   - Zod for validation.
   - A fetch implementation if your Node version doesn’t have fetch built in.
3. Install development dependencies:
   - TypeScript.
   - Type definitions for Node and Express.
   - A dev runner (like ts-node-dev or nodemon plus a TypeScript runner).
   - ESLint and its TypeScript integration.
   - Optionally Prettier and an ESLint config that disables style rules conflicting with Prettier.
4. Initialize TypeScript:
   - Generate a TypeScript config file.
   - Set a reasonable JavaScript target.
   - Choose a module system (CommonJS or ESM).
   - Set the root directory for your TypeScript source (for example, a server folder).
   - Set the output directory for compiled JavaScript.
   - Enable strict type checking.
5. Initialize ESLint:
   - Configure it to work with TypeScript.
   - Set the environment to Node.
   - Optionally integrate Prettier by extending the appropriate config.
6. Add npm scripts:
   - One script to run the dev server using your TypeScript runner.
   - One script to run ESLint on your TypeScript files.

---

### Phase 1 – Minimal server and ping route

1. Create a server entry file in your server folder.
2. Import and initialize Express in that file.
3. Add middleware to parse JSON request bodies.
4. Define a GET route at the path “/ping” that returns a JSON object with a message saying “pong”.
5. Start the server on port 3000 and log that it’s running.
6. Test the ping route in a browser or with a tool like curl or Postman to confirm you get the expected JSON response.

---

### Phase 2 – GET /random-person

1. Decide how you will call the RandomUser API:
   - Use the global fetch if your Node version supports it, or
   - Use the fetch implementation you installed earlier.
2. Design a Zod schema that matches only the parts of the RandomUser response you care about:
   - The user’s name (first and last).
   - The user’s country (inside the location object).
3. Add a GET route at the path “/random-person”.
4. Inside that route:
   - Call the RandomUser API endpoint.
   - Parse the JSON response.
   - Validate the response using your Zod schema.
   - Extract the first user from the results.
   - Build a full name string from first and last name.
   - Extract the country.
   - Return a JSON object containing the full name and country.
5. Handle errors:
   - If the fetch fails or validation fails, return an appropriate error status and message.
6. Test the route and confirm you get a full name and country in the response.

---

### Phase 3 – POST /users with Zod validation

1. Design a Zod schema for the incoming user object with these rules:
   - Name: a string with a minimum and maximum length (3–12 characters).
   - Age: optional, must be a number between 18 and 100, and should default to 28 if not provided.
   - Email: must be a valid email format and should be transformed to lowercase.
2. Add a POST route at the path “/users”.
3. In that route:
   - Read the JSON body from the request.
   - Validate it using your Zod schema.
   - If validation succeeds:
     - Return a 201 status code.
     - Return the validated (and transformed) user object.
   - If validation fails:
     - Return a 400 status code.
     - Return a structured description of the validation errors (for example, the list of issues from Zod).
4. Test with multiple payloads:
   - A fully valid user.
   - A user without age (to see the default applied).
   - Invalid users (too short name, invalid email, age out of range) to confirm you get 400 and clear error details.

---

### Optional – GET /random-address

1. Design a Zod schema that focuses on:
   - The location object.
   - The city.
   - The postcode (which may be a string or a number).
2. Add a GET route at the path “/random-address”.
3. In that route:
   - Fetch a random user from the RandomUser API.
   - Parse the JSON response.
   - Validate it with your address-focused Zod schema.
   - Extract the city and postcode from the first result.
   - Convert the postcode to a string if necessary for consistency.
   - Return a JSON object containing the city and postcode.
4. Handle errors similarly to the random-person route.
5. Test the route and confirm you get city and postcode.

---

### Challenge – GET /random-login

1. Design a Zod schema that focuses on:
   - The login object with a username field.
   - The registered object with a date field (as a string).
2. Add a GET route at the path “/random-login”.
3. In that route:
   - Fetch a random user from the RandomUser API.
   - Parse the JSON response.
   - Validate it using your login-focused Zod schema.
   - Extract the username and the registered date from the first result.
   - Format the date to only include the date part (for example, year-month-day).
   - Build a short summary string combining the username and the formatted date in the required format.
   - Return a JSON object containing:
     - The username.
     - The registered date.
     - The summary string.
4. Handle errors for fetch and validation.
5. Test the route and confirm the summary reads as specified.

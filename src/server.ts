//SECTION -  Imports
import express from "express";
import { z } from "zod";

// Variables
const app = express();
const port = process.env.PORT || "3010";
const api = "https://randomuser.me/api/";
const urlSchema = z.url();

//SECTION - Schemas
// API schema
const userSchema = z.object({
  results: z
    .array(
      z.object({
        name: z.object({
          first: z.string(),
          last: z.string(),
        }),
        location: z.object({
          country: z.string(),
        }),
      }),
    )
    .nonempty(),
});

// New User schema
const newUserSchema = z.object({
  name: z.object({
    first: z
      .string()
      .min(3, { message: "Min 3 chars." })
      .max(12, { message: "Max 12 chars." }),
    last: z
      .string()
      .min(3, { message: "Min 3 chars." })
      .max(12, { message: "Max 12 chars." }),
  }),
  age: z
    .number()
    .min(18, { message: "Must be at least 18 yo." })
    .max(3000, { message: "Must be under 3000 light years." }),
  email: z.email({ message: "Invalid email address" }),
}); //TODO -  Email: must be a valid email format and should be transformed to lowercase.

// Random Address schema
const randomAddressSchema = z.object({
  results: z.array(
    z.object({
      location: z.object({
        city: z.string(),
        postcode: z.union([z.string(), z.number()]),
      }),
    }),
  ),
});

// Random Login Schema
const randomLoginSchema = z.object({
  results: z.array(
    z.object({
      login: z.object({
        username: z.string(),
      }),
      registered: z.object({
        date: z.string(),
      }),
    }),
  ),
});

//SECTION - Functions
// Validation
const validateUser = <T>(schema: z.ZodSchema<T>, inputData: unknown): T => {
  const result = schema.safeParse(inputData);
  if (result.success) {
    console.log(result.data);
    return result.data;
  } else {
    console.error(result.error);
    throw new Error("Invalid input.", { cause: result.error });
  }
};

// Fetch API data
const fetchData = async <T>(
  url: z.infer<typeof urlSchema>,
  schema: z.ZodSchema<T>,
): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return validateUser(schema, data);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch data from: ${url}`, { cause: error });
  }
};

//SECTION -  JSON parsing
app.use(express.json());

// Start the server on PORT
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

// Minimal server
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

//SECTION -  GET Routes. Random person route / address
// Random person fetch
app.get("/random-user", async (_req, res) => {
  try {
    const validateData = await fetchData(api, userSchema);

    const randomUser = validateData.results[0];

    // Returns user's full name and country
    return res.json({
      name: `${randomUser?.name.first} ${randomUser?.name.last}`,
      location: randomUser?.location.country,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch random user.",
    });
  }
});

// Random address fetch
app.get("/random-address", async (_req, res) => {
  try {
    const validateData = await fetchData(api, randomAddressSchema);
    const randomAddress = validateData.results[0]?.location;

    return res.json({
      city: randomAddress?.city,
      postcode: randomAddress?.postcode.toString(),
    });
  } catch (error) {
    return res.status(400).json({
      error: "Failed to fetch random address.",
    });
  }
});

// Random Login Fetch
app.get("/random-login", async (_req, res) => {
  try {
    const validateData = await fetchData(api, randomLoginSchema);
    const randomLogin = validateData.results[0];

    return res.json({
      username: randomLogin?.login.username,
      date: randomLogin?.registered.date.split("T")[0],
      message: `The user: ${randomLogin?.login.username}, was registered on the: ${randomLogin?.registered.date.split("T")[0]}`,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Failed to fetch random login details.",
    });
  }
});

//SECTION -  POST
app.post("/users", (req, res) => {
  try {
    const validateData = validateUser(newUserSchema, req.body);
    const newUser = validateData;

    res.status(201).json({
      message: "New user created successfully!",
      user: newUser,
    });
  } catch (error) {
    //TODO - Return a structured description of the validation errors (for example, the list of issues from Zod).
    res.status(400).json({ error: "Failed to create new user." });
  }
});

// curl http://localhost:3000/api/users
// To send a POST request to a specific route with data:
// curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john.doe@example.com"}' http://localhost:3000/api/users
// To send a PUT request to update a resource:
// curl -X PUT -H "Content-Type: application/json" -d '{"name": "Jane Smith"}' http://localhost:3000/api/users/123
// To send a DELETE request to delete a resource:
// curl -X DELETE http://localhost:3000/api/users/123
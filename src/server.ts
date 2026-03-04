// Imports
import express from "express";
import { z } from "zod";

// Variables
const app = express();
const port = process.env.PORT || "3010";

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

// JSON parsing
app.use(express.json());

// Start the server on PORT
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

// Minimal server
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Random person route
app.get("/user", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();

    const validateUser = userSchema.safeParse(data);
    if (!validateUser.success) {
      return res.status(500).json({
        error: "Invalid data from Random User API.",
        details: validateUser.error,
      });
    }
    const randomUser = validateUser.data.results[0];

    return res.json({
      name: `${randomUser?.name.first} ${randomUser?.name.last}`,
      location: randomUser?.location.country,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch random user",
    });
  }
});

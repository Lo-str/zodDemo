```ts
// 1. Install Zod and Express
// npm install zod express

// 2. Import dependencies
import { z } from "zod";
import express from "express";

// 3. Basic Schema Validation
const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(10, { message: "Username must be at most 10 characters long" });

// Example usage:
const validatedUsername = usernameSchema.safeParse("mosh");
if (validatedUsername.success) {
  console.log(validatedUsername.data); // "mosh"
} else {
  console.error(validatedUsername.error);
}

// 4. Object Schema
const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(10, { message: "Name must be at most 10 characters long" }),
  age: z
    .number()
    .min(18, { message: "You must be at least 18 years old" })
    .max(100, { message: "You must be at most 100 years old" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

// Example usage:
const user = {
  name: "Mosh",
  age: 46,
  email: "mosh@example.com",
};

const validatedUser = userSchema.safeParse(user);
if (validatedUser.success) {
  console.log(validatedUser.data);
} else {
  console.error(validatedUser.error);
}

// 5. Express + Zod Integration
const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/users", (req, res) => {
  const validatedNewUser = userSchema.safeParse(req.body);
  if (!validatedNewUser.success) {
    return res.status(400).json({
      error: "Invalid user data",
      details: validatedNewUser.error,
    });
  }
  res.status(201).json({ user: validatedNewUser.data });
});

// 6. Advanced Schema: Nested Objects and Arrays
const restaurantSchema = z.object({
  name: z.string(),
  menu: z.object({
    appetizers: z
      .array(z.string())
      .min(1, "At least one appetizer is required"),
    mains: z.array(z.string()).min(1, "At least one main dish is required"),
  }),
  openingHours: z.record(z.string(), z.array(z.string())),
});

// Example usage:
const restaurant = {
  name: "Tasty Bites",
  menu: {
    appetizers: ["Bruschetta", "Calamari"],
    mains: ["Pasta", "Risotto"],
  },
  openingHours: {
    Monday: ["9:00", "21:00"],
    Tuesday: ["9:00", "21:00"],
  },
};

const validatedRestaurant = restaurantSchema.safeParse(restaurant);
if (validatedRestaurant.success) {
  console.log(validatedRestaurant.data);
} else {
  console.error(validatedRestaurant.error);
}

// 7. Transforming Data
const emailSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
});

// Example usage:
const result = emailSchema.safeParse({ email: "MOSH@EXAMPLE.COM" });
if (result.success) {
  console.log(result.data); // { email: "mosh@example.com" }
} else {
  console.error(result.error);
}

// 8. Real-World API Integration
const randomUserResponseSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      email: z.string().email(),
    }),
  ),
});

app.get("/random-user", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const validatedRandomUser = randomUserResponseSchema.safeParse(data);

    if (!validatedRandomUser.success) {
      return res.status(500).json({
        error: "Invalid data from Random User API",
        details: validatedRandomUser.error,
      });
    }

    const randomUser = validatedRandomUser.data.results[0];
    res.json({
      name: `${randomUser.name.first} ${randomUser.name.last}`,
      email: randomUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random user" });
  }
});

// 9. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 10. Challenge: Blog Post Schema
const blogPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .default(new Date().toISOString()),
});

app.post("/posts", (req, res) => {
  const validatedPost = blogPostSchema.safeParse(req.body);
  if (!validatedPost.success) {
    return res.status(400).json({
      error: "Invalid post data",
      details: validatedPost.error,
    });
  }
  res.status(201).json({ post: validatedPost.data });
});
```

---

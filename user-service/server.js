const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "user_service_db",
  password: "hamza",
  port: 5432,
});


app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error saving user" });
        }
        const user = result.rows[0];
        res.status(201).json(user);
      }
    );
  });
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  pool.query("SELECT * FROM users WHERE email = $1", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err || !isValid) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, "your-secret-key", { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

app.listen(5001, () => {
  console.log("🚀 User Service running on port 5001");
});
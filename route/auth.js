const express = require("express");
const router = express.Router();
const { conn } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await conn.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await conn.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id_user, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: your.jwt.token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const { rows } = await conn.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!rows)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = rows[0];

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({
        message: "Invalid email or password",
      });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id_user:
 *           type: integer
 *           description: Auto-generated ID of the user
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: yourpassword123
 *         roles:
 *           type: integer
 *           enum: [1, 2, 3]
 *           description: 1=Staff BloodBank, 2=Staff Rumah Sakit, 3=Default
 */
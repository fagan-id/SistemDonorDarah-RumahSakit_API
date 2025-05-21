/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */
const express = require("express");
const router = express.Router();
const { conn } = require("../database");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched users data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Fetched Users Data!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_user:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *                       password:
 *                         type: string
 *       404:
 *         description: Users data is empty or fetch failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users data is empty.
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/", async (req, res) => {
  try {
    const { rows } = await conn.query("SELECT * FROM USERS");

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Users data is empty.`,
      });
    }
    res.status(200).json({
      message: "Successfully Fetched Users Data!",
      data: rows,
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed to fetch users data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Fetched Users Data!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_user:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *                       password:
 *                         type: string
 *       404:
 *         description: User not found or fetch failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users data is empty.
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      "SELECT * FROM USERS where id_user = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Users data is empty.`,
      });
    }
    res.status(200).json({
      message: "Successfully Fetched Users Data!",
      data: rows,
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed to fetch users data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successfully updated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully updated user!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     password:
 *                       type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with id 1 not found.
 *       400:
 *         description: Failed to update user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update user data!
 *                 error:
 *                   type: string
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
    // Update user and return updated row
    const updateQuery = `
        UPDATE USERS
        SET email = $1,
            username = $2,
            password = $3
        WHERE id_user = $4
        RETURNING *
      `;

    const { rows } = await conn.query(updateQuery, [
      email,
      username,
      password,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `User with id ${id} not found.`,
      });
    }

    res.status(200).json({
      message: "Successfully updated user!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update user data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted user!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     password:
 *                       type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with id 1 not found.
 *       400:
 *         description: Failed to delete user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to delete user!
 *                 error:
 *                   type: string
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteQuery = "DELETE FROM USERS WHERE id_user = $1 RETURNING *";
    const { rows } = await conn.query(deleteQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `User with id ${id} not found.`,
      });
    }

    res.status(200).json({
      message: "Successfully deleted user!",
      data: rows[0]
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete user!",
      error: error.message
    });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Confirmed
 *   description: Confirmed blood requests management
 */

const express = require('express');
const router = express.Router();
const { conn } = require('../database');

/**
 * @swagger
 * /confirmed:
 *   get:
 *     summary: Get all confirmed requests
 *     tags: [Confirmed]
 *     responses:
 *       200:
 *         description: Successfully fetched confirmed data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched confirmed data!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Confirmed'
 *       404:
 *         description: No confirmed data found
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
    try {
        const {rows} = await conn.query("SELECT * FROM CONFIRMED");

        if (rows.length === 0) {
          return res.status(404).json({
            message: `Confirmed data is empty.`,
          });
        }

        res.status(200).json({
            message : "Succesfully Fetch Confirmed Data!",
            data : rows
        });
    } catch (error) {
        res.status(400).json({
            message : "Failed To Fetch Confirmed Data!",
            error : error.message
        });
    }
});

/**
 * @swagger
 * /confirmed/{id}:
 *   get:
 *     summary: Get confirmed request by ID
 *     tags: [Confirmed]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the confirmed request
 *     responses:
 *       200:
 *         description: Successfully fetched confirmed request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully fetched confirmed request!
 *                 data:
 *                   $ref: '#/components/schemas/Confirmed'
 *       404:
 *         description: Confirmed request not found
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const {rows} = await conn.query("SELECT * FROM CONFIRMED WHERE ID_CONFIRMED = $1",[id]);

        if (rows.length === 0) {
          return res.status(404).json({
            message: `Confirmed data with ID ${id} is not found.`,
          });
        }
        res.status(200).json({
            message : "Succesfully Fetch Confirmed Data!",
            data : rows[0]
        });
    } catch (error) {
        res.status(400).json({
            message : "Failed To Fetch Confirmed Data!",
            error : error.message
        });
    }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Confirmed:
 *       type: object
 *       properties:
 *         id_confirmed:
 *           type: integer
 *           example: 1
 *         id_patient:
 *           type: integer
 *           example: 2
 *         id_doctor:
 *           type: integer
 *           example: 3
 *         bloodtype:
 *           type: string
 *           example: O
 *         rhesus:
 *           type: string
 *           example: "+"
 *         quantity:
 *           type: integer
 *           example: 2
 *         urgency:
 *           type: integer
 *           example: 3
 *         status:
 *           type: integer
 *           example: 1
 *         requestedat:
 *           type: string
 *           format: date-time
 *           example: "2025-05-21T02:20:19.309Z"
 */
module.exports = router;
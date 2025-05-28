/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Hospital Doctor Data
 */
const express = require("express");
const router = express.Router();
const { conn } = require("../database");
/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieves all doctor records from the database with their complete information
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Successfully retrieved all doctors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorResponse'
 *             example:
 *               message: "Successfully Fetch from Doctor Data!"
 *               data:
 *                 - id_doctor: 1
 *                   id_hospital: 1
 *                   doctorname: "dr. Anisa Putri"
 *                   specialization: "Spesialis Jantung"
 *                   email: "anisa.putri@example.com"
 *                 - id_doctor: 2
 *                   id_hospital: 1
 *                   doctorname: "dr. Rudi Hartono"
 *                   specialization: "Spesialis Bedah Umum"
 *                   email: "rudi.hartono@example.com"
 *                 - id_doctor: 3
 *                   id_hospital: 2
 *                   doctorname: "dr. Sari Dewi"
 *                   specialization: "Spesialis Anak"
 *                   email: "sari.dewi@example.com"
 *       404:
 *         description: No doctors found in the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorNotFoundResponse'
 *             example:
 *               message: "No data found."
 *       400:
 *         description: Bad request or database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorErrorResponse'
 *             example:
 *               message: "Failed to fetch Doctor Data!"
 *               error: "Database connection timeout"
 */
router.get("/", async (req, res) => {
  try {
    const { rows } = await conn.query(`
        SELECT * FROM DOCTOR`);
    if (rows.length === 0) {
      return res.status(404).json({
        message: `No  data found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully Fetch from Doctor Data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch Doctor Data!",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     description: Retrieves a specific doctor by their unique ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The doctor ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the doctor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorSingleResponse'
 *             example:
 *               message: "Successfully Fetch Doctor Data!"
 *               data:
 *                 - id_doctor: 1
 *                   id_hospital: 1
 *                   doctorname: "dr. Anisa Putri"
 *                   specialization: "Spesialis Jantung"
 *                   email: "anisa.putri@example.com"
 *       404:
 *         description: Doctor with the specified ID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorNotFoundResponse'
 *             example:
 *               message: "No Doctor with id : 1 found."
 *       400:
 *         description: Bad request or database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorErrorResponse'
 *             example:
 *               message: "Failed to fetch Doctor Data!"
 *               error: "Invalid doctor ID format"
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `SELECT * FROM DOCTOR where id_doctor = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: `No Doctor with id : ${id}  found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully Fetch Doctor Data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch Doctor Data!",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         id_doctor:
 *           type: integer
 *           description: Unique identifier for the doctor
 *           example: 1
 *         id_hospital:
 *           type: integer
 *           description: Hospital ID where doctor works
 *           example: 1
 *         doctorname:
 *           type: string
 *           maxLength: 200
 *           description: Doctor's full name
 *           example: "dr. Anisa Putri"
 *         specialization:
 *           type: string
 *           maxLength: 300
 *           description: Doctor's medical specialization
 *           example: "Spesialis Jantung"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 200
 *           description: Doctor's email address
 *           example: "anisa.putri@example.com"
 *       required:
 *         - id_doctor
 *         - id_hospital
 *         - doctorname
 *         - specialization
 *         - email
 *     
 *     DoctorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Successfully Fetch from Doctor Data!"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Doctor'
 *     
 *     DoctorSingleResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Successfully Fetch Doctor Data!"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Doctor'
 *           maxItems: 1
 *     
 *     DoctorErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Failed to fetch Doctor Data!"
 *         error:
 *           type: string
 *           description: Detailed error information
 *           example: "Database connection failed"
 *     
 *     DoctorNotFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Not found message
 *           example: "No data found."
 * 
 * tags:
 *   name: Doctor
 *   description: Hospital Doctor Data Management
 */

module.exports = router;

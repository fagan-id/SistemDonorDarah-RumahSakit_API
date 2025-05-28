/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Hospital Patient Data
 */
const express = require("express");
const router = express.Router();
const { conn } = require("../database");
/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a list of all patients with their full information including concatenated full name
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Successfully retrieved all patients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientResponse'
 *             example:
 *               message: "Successfully Fetch Patient Data!"
 *               data:
 *                 - id_patient: 1
 *                   id_hospital: 1
 *                   firstname: "John"
 *                   lastname: "Doe"
 *                   fullname: "John Doe"
 *                   bloodtype: "O"
 *                   rhesus: "+"
 *                   dateofbirth: "1985-02-15"
 *                   gender: "Male"
 *                 - id_patient: 2
 *                   id_hospital: 2
 *                   firstname: "Jane"
 *                   lastname: "Smith"
 *                   fullname: "Jane Smith"
 *                   bloodtype: "A"
 *                   rhesus: "-"
 *                   dateofbirth: "1990-06-30"
 *                   gender: "Female"
 *       404:
 *         description: No patients found in the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               message: "No patient data found."
 *       400:
 *         description: Bad request or database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Failed to fetch Patient Data!"
 *               error: "Database connection timeout"
 */
router.get("/", async (req, res) => {
  try {
    const { rows } =
      await conn.query(` 
        SELECT *, firstname || ' ' || lastname AS fullname
        FROM PATIENT
        `);
    if (rows.length === 0) {
      return res.status(404).json({
        message: `No patient data found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully Fetch Patient Data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch Patient Data!",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Get patient by ID
 *     description: Retrieve a specific patient by their unique ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The patient ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the patient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatientSingleResponse'
 *             example:
 *               message: "Successfully Fetch Patient Data!"
 *               data:
 *                 - id_patient: 1
 *                   id_hospital: 1
 *                   firstname: "John"
 *                   lastname: "Doe"
 *                   fullname: "John Doe"
 *                   bloodtype: "O"
 *                   rhesus: "+"
 *                   dateofbirth: "1985-02-15"
 *                   gender: "Male"
 *       404:
 *         description: Patient with the specified ID not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               message: "No Patient with id : 1 found."
 *       400:
 *         description: Bad request or database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Failed to fetch Patient Data!"
 *               error: "Invalid patient ID format"
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `SELECT *, 
        firstname || ' ' || lastname AS fullname
        FROM PATIENT 
        where id_patient = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: `No Patient with id : ${id}  found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully Fetch Patient Data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch Patient Data!",
      error: error.message,
    });
  }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id_patient:
 *           type: integer
 *           description: Unique identifier for the patient
 *           example: 1
 *         id_hospital:
 *           type: integer
 *           description: Hospital ID where patient is registered
 *           example: 1
 *         firstname:
 *           type: string
 *           maxLength: 200
 *           description: Patient's first name
 *           example: "John"
 *         lastname:
 *           type: string
 *           maxLength: 200
 *           description: Patient's last name
 *           example: "Doe"
 *         fullname:
 *           type: string
 *           description: Concatenated first and last name (computed field)
 *           example: "John Doe"
 *         bloodtype:
 *           type: string
 *           enum: ["O", "A", "B", "AB"]
 *           description: Patient's blood type
 *           example: "O"
 *         rhesus:
 *           type: string
 *           enum: ["+", "-"]
 *           description: Patient's rhesus factor
 *           example: "+"
 *         dateofbirth:
 *           type: string
 *           format: date
 *           description: Patient's date of birth
 *           example: "1985-02-15"
 *         gender:
 *           type: string
 *           maxLength: 10
 *           description: Patient's gender
 *           example: "Male"
 *       required:
 *         - id_patient
 *         - id_hospital
 *         - firstname
 *         - lastname
 *         - fullname
 *         - bloodtype
 *         - rhesus
 *         - dateofbirth
 *     
 *     PatientResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Successfully Fetch Patient Data!"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Patient'
 *     
 *     PatientSingleResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Response message
 *           example: "Successfully Fetch Patient Data!"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Patient'
 *           maxItems: 1
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Failed to fetch Patient Data!"
 *         error:
 *           type: string
 *           description: Detailed error information
 *           example: "Database connection failed"
 *     
 *     NotFoundResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Not found message
 *           example: "No patient data found."
 * 
 * tags:
 *   name: Patient
 *   description: Hospital Patient Data Management
 */
module.exports = router;

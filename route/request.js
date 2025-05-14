const express = require("express");
const router = express.Router();
const { conn } = require("../database");

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all blood requests
 *     description: Retrieves all blood request records from the database
 *     tags:
 *       - Requests
 *     responses:
 *       200:
 *         description: Successfully retrieved request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully Fetch Request Data!"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       404:
 *         description: No request data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No request data found."
 *       400:
 *         description: Failed to retrieve request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch request Data!"
 *                 data:
 *                   type: object
 */
router.get("/", async (req, res) => {
  try {
    const { rows } = await conn.query(`SELECT * FROM REQUEST`);
    if (rows.length === 0) {
        return res.status(404).json({
          message: `No request data found.`,
        });
      }
    res.status(200).json({
      message: "Succesfully Fetch Request Data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch request Data!",
      data: rows[0],
    });
  }
});

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     description: Retrieves a specific blood request by its ID
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Successfully retrieved request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully Fetch Request Data!"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request data with ID 123 not found."
 *       400:
 *         description: Failed to retrieve request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch request Data!"
 *                 data:
 *                   type: object
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `SELECT * FROM REQUEST where id_request = $1`,
      [id]
    );
    if (rows.length === 0) {
        return res.status(404).json({
          message: `Request data with ID ${id} not found.`,
        });
      }
    res.status(200).json({
      message: "Succesfully Fetch Request Data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch request Data!",
      data: rows[0],
    });
  }
});

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new blood request
 *     description: Creates a new blood request record in the database
 *     tags:
 *       - Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_hospital
 *               - id_patient
 *               - bloodtype
 *               - rhesus
 *               - quantity
 *               - urgency
 *               - status
 *             properties:
 *               id_hospital:
 *                 type: integer
 *                 description: Hospital ID (foreign key to hospital table)
 *                 example: 1
 *               id_patient:
 *                 type: integer
 *                 description: Patient ID (foreign key to patient table)
 *                 example: 1
 *               bloodtype:
 *                 type: string
 *                 enum: [O, A, B, AB]
 *                 description: Blood type requested
 *                 example: "A"
 *               rhesus:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Rhesus factor requested
 *                 example: "+"
 *               quantity:
 *                 type: integer
 *                 description: Number of blood units requested
 *                 example: 2
 *               urgency:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: Urgency level (1=low, 2=normal, 3=high)
 *                 example: 2
 *               status:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: Request status (0=waiting, 1=approved, 2=rejected)
 *                 example: 0
 *     responses:
 *       201:
 *         description: Successfully created request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully Created a Request Data!"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Failed to create request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch request Data!"
 *                 data:
 *                   type: object
 */
router.post("/", async (req, res) => {
  const {
    id_hospital,
    id_patient,
    bloodtype,
    rhesus,
    quantity,
    urgency,
    status,
  } = req.body;
  const requestedat = new Date().toISOString();

  try {
    const insertQuery = `INSERT INTO REQUEST (id_hospital,id_patient,bloodtype,rhesus,quantity,urgency,status,requestedat)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const { rows } = await conn.query(insertQuery, [
      id_hospital,
      id_patient,
      bloodtype,
      rhesus,
      quantity,
      urgency,
      status,
      requestedat,
    ]);
    
    res.status(201).json({
      message: "Succesfully Created a Request Data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch request Data!",
      data: rows[0],
    });
  }
});

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update blood request
 *     description: Updates an existing blood request by ID
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_hospital
 *               - id_patient
 *               - bloodtype
 *               - rhesus
 *               - quantity
 *               - urgency
 *               - status
 *             properties:
 *               id_hospital:
 *                 type: integer
 *                 description: Hospital ID (foreign key to hospital table)
 *                 example: 1
 *               id_patient:
 *                 type: integer
 *                 description: Patient ID (foreign key to patient table)
 *                 example: 1
 *               bloodtype:
 *                 type: string
 *                 enum: [O, A, B, AB]
 *                 description: Blood type requested
 *                 example: "A"
 *               rhesus:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Rhesus factor requested
 *                 example: "+"
 *               quantity:
 *                 type: integer
 *                 description: Number of blood units requested
 *                 example: 2
 *               urgency:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 description: Urgency level (1=low, 2=normal, 3=high)
 *                 example: 2
 *               status:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 description: Request status (0=waiting, 1=approved, 2=rejected)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Successfully updated request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully updated a Request Data!"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request data with ID 123 not found."
 *       400:
 *         description: Failed to update request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update a request Data!"
 *                 data:
 *                   type: object
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_hospital,
    id_patient,
    bloodtype,
    rhesus,
    quantity,
    urgency,
    status,
  } = req.body;
  const requestedat = new Date().toISOString();

  try {
    const insertQuery = `UPDATE REQUEST
                            SET 
                                id_hospital = $1,
                                id_patient = $2,
                                bloodtype = $3,
                                rhesus = $4,
                                quantity = $5,
                                urgency = $6,
                                status = $7,
                                requestedat = $8
                            WHERE id_request = $9
                            RETURNING *`;
    const { rows } = await conn.query(insertQuery, [
      id_hospital,
      id_patient,
      bloodtype,
      rhesus,
      quantity,
      urgency,
      status,
      requestedat,
      id,
    ]);

    if (rows.length === 0) {
        return res.status(404).json({
          message: `Request data with ID ${id} not found.`,
        });
      }

    res.status(201).json({
      message: "Succesfully updated a Request Data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update a request Data!",
      data: rows[0],
    });
  }
});

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete blood request
 *     description: Deletes a blood request by ID
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully deleted Request Data!"
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request data with ID 123 not found."
 *       400:
 *         description: Failed to delete request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete request Data!"
 *                 data:
 *                   type: object
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `DELETE FROM REQUEST WHERE id_request =$1`,
      [id]
    );
    if (rows.length === 0) {
        return res.status(404).json({
          message: `Request data with ID ${id} not found.`,
        });
      }
      
    res.status(200).json({
      message: "Succesfully deleted Request Data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete request Data!",
      data: rows[0],
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         id_request:
 *           type: integer
 *           description: The unique identifier for the blood request
 *           example: 1
 *         id_hospital:
 *           type: integer
 *           description: The hospital's identifier (foreign key)
 *           example: 1
 *         id_patient:
 *           type: integer
 *           description: The patient's identifier (foreign key)
 *           example: 1
 *         bloodType:
 *           type: string
 *           enum: [O, A, B, AB]
 *           description: Blood type requested
 *           example: "A"
 *         rhesus:
 *           type: string
 *           enum: ["+", "-"]
 *           description: Rhesus factor requested
 *           example: "+"
 *         quantity:
 *           type: integer
 *           description: Number of blood units requested
 *           example: 2
 *         urgency:
 *           type: integer
 *           enum: [1, 2, 3]
 *           description: Urgency level (1=low, 2=normal, 3=high)
 *           example: 2
 *         status:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: Request status (0=waiting, 1=approved, 2=rejected)
 *           example: 0
 *         requestedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the request was created
 *           example: "2025-05-14T10:00:00Z"
 */

module.exports = router;
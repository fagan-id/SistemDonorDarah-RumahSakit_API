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
 *                   example: [
 *                     {
 *                       "id_request": 1,
 *                       "patient_name": "John Doe",
 *                       "doctorname": "dr. Anisa Putri",
 *                       "hospital_name": "RSUP Dr. Sardjito",
 *                       "bloodtype": "A",
 *                       "rhesus": "+",
 *                       "quantity": 2,
 *                       "urgency": 3,
 *                       "status": 0,
 *                       "requestedat": "2025-05-21T05:20:14.360Z"
 *                     },
 *                     {
 *                       "id_request": 2,
 *                       "patient_name": "Jane Smith",
 *                       "doctorname": "dr. Sari Dewi",
 *                       "hospital_name": "RSUD Dr. Soetomo",
 *                       "bloodtype": "B",
 *                       "rhesus": "-",
 *                       "quantity": 1,
 *                       "urgency": 2,
 *                       "status": 1,
 *                       "requestedat": "2025-05-21T05:20:14.360Z"
 *                     }
 *                   ]
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
 *                 error:
 *                   type: string
 */
router.get("/", async (req, res) => {
  try {
    const { rows } = await conn.query(`
                                     SELECT
                                      request.id_request,
                                      patient.firstname || ' ' || patient.lastname AS patient_name,
                                      doctor.doctorname,
                                      hospital.hospitalname AS hospital_name,
                                      request.bloodtype,
                                      request.rhesus,
                                      request.quantity,
                                      request.urgency,
                                      request.status,
                                      request.requestedat
                                  FROM request
                                  JOIN patient ON request.id_patient = patient.id_patient
                                  JOIN doctor ON request.id_doctor = doctor.id_doctor
                                  JOIN hospital ON doctor.id_hospital = hospital.id_hospital;
                                  `);
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
      error: error.message,
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
 *                   example:
 *                     {
 *                       "id_request": 1,
 *                       "patient_name": "John Doe",
 *                       "doctorname": "dr. Anisa Putri",
 *                       "hospital_name": "RSUP Dr. Sardjito",
 *                       "bloodtype": "A",
 *                       "rhesus": "+",
 *                       "quantity": 2,
 *                       "urgency": 3,
 *                       "status": 0,
 *                       "requestedat": "2025-05-21T05:20:14.360Z"
 *                     }
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
 *                 error:
 *                   type: string
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `SELECT
        request.id_request,
        patient.firstname || ' ' || patient.lastname AS patient_name,
        doctor.doctorname,
        hospital.hospitalname AS hospital_name,
        request.bloodtype,
        request.rhesus,
        request.quantity,
        request.urgency,
        request.status,
        request.requestedat
    FROM request
    JOIN patient ON request.id_patient = patient.id_patient
    JOIN doctor ON request.id_doctor = doctor.id_doctor
    JOIN hospital ON doctor.id_hospital = hospital.id_hospital
    WHERE id_request = $1`,
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
      error: error.message,
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
 *               - id_patient
 *               - id_doctor
 *               - bloodtype
 *               - rhesus
 *               - quantity
 *               - urgency
 *               - status
 *             properties:
 *               id_patient:
 *                 type: integer
 *                 description: Patient ID (foreign key to patient table)
 *                 example: 1
 *               id_doctor:
 *                 type: integer
 *                 description: Doctor ID (foreign key to doctor table)
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
 *                 example: 3
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
 *                 error:
 *                   type: string
 */
router.post("/", async (req, res) => {
  const {
    id_patient,
    id_doctor,
    bloodtype,
    rhesus,
    quantity,
    urgency,
    status,
  } = req.body;
  const requestedat = new Date().toISOString();

  try {
    const insertQuery = `INSERT INTO REQUEST (id_patient,id_doctor,bloodtype,rhesus,quantity,urgency,status,requestedat)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const { rows } = await conn.query(insertQuery, [
      id_patient,
      id_doctor,
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
      error: error.message,
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
 *               - id_patient
 *               - id_doctor
 *               - bloodtype
 *               - rhesus
 *               - quantity
 *               - urgency
 *               - status
 *             properties:
 *               id_patient:
 *                 type: integer
 *                 description: Patient ID (foreign key to patient table)
 *                 example: 1
 *               id_doctor:
 *                 type: integer
 *                 description: Doctor ID (foreign key to doctor table)
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
 *                 error:
 *                   type: string
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    id_patient,
    id_doctor,
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
                                id_patient = $1,
                                id_doctor = $2,
                                bloodtype = $3,
                                rhesus = $4,
                                quantity = $5,
                                urgency = $6,
                                status = $7,
                                requestedat = $8
                            WHERE id_request = $9
                          RETURNING id_request, id_patient, id_doctor, bloodtype, rhesus, quantity, urgency, status, requestedat`;
    const { rows } = await conn.query(insertQuery, [
      id_patient,
      id_doctor,
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

    const updatedRequest = rows[0];
    console.log('Inserting into confirmed with id_request:', updatedRequest.id_request);

    // 2. If status is 1 or 2, move to confirmed table
    if (status === 1 || status === 2) {
      const insertConfirmedQuery = `
        INSERT INTO confirmed (
          id_patient,
          id_doctor,
          bloodtype,
          rhesus,
          quantity,
          urgency,
          status,
          requestedat
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
      `;

      await conn.query(insertConfirmedQuery, [
        updatedRequest.id_patient,
        updatedRequest.id_doctor,
        updatedRequest.bloodtype,
        updatedRequest.rhesus,
        updatedRequest.quantity,
        updatedRequest.urgency,
        updatedRequest.status,
        updatedRequest.requestedat,
      ]);

      try {
        await conn.query(`DELETE FROM request WHERE id_request = $1;`, [id]);
        console.log("After deleting from request");
      } catch (deleteError) {
        console.error("Failed to delete from request:", deleteError.message);
      }
      
    }

    res.status(201).json({
      message: "Succesfully updated a Request Data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update a request Data!",
      error: error.message,
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
 *                 error:
 *                   type: string
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      `DELETE FROM REQUEST WHERE id_request =$1 RETURNING *`,
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
      error: error.message,
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
 *         patient_name:
 *           type: string
 *           description: Full name of the patient
 *           example: "John Doe"
 *         doctorname:
 *           type: string
 *           description: Name of the doctor
 *           example: "dr. Anisa Putri"
 *         hospital_name:
 *           type: string
 *           description: Name of the hospital
 *           example: "RSUP Dr. Sardjito"
 *         bloodtype:
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
 *           example: 3
 *         status:
 *           type: integer
 *           enum: [0, 1, 2]
 *           description: Request status (0=waiting, 1=approved, 2=rejected)
 *           example: 0
 *         requestedat:
 *           type: string
 *           format: date-time
 *           description: Date and time when the request was created
 *           example: "2025-05-21T05:20:14.360Z"
 */

module.exports = router;

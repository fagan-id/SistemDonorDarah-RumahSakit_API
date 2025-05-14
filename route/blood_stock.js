const express = require("express");
const router = express.Router();
const { conn } = require("../database");

/**
 * @swagger
 * /stock/total:
 *   get:
 *     summary: Get aggregate blood stock information
 *     description: Retrieves aggregated blood stock information grouped by blood type and rhesus factor
 *     tags:
 *       - Blood Stocks
 *     responses:
 *       200:
 *         description: Successfully retrieved blood stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully get all blood stocks available!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bloodType:
 *                         type: string
 *                         enum: [O, A, B, AB]
 *                         example: "A"
 *                       rhesus:
 *                         type: string
 *                         enum: ["+", "-"]
 *                         example: "+"
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       total_volume:
 *                         type: number
 *                         format: float
 *                         example: 4500
 *       400:
 *         description: Failed to get blood stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get blood stocks data!"
 *                 error:
 *                   type: object
 */
router.get("/total", async (req, res) => {
  try {
    const getQuery = `SELECT 
        bloodType,
        rhesus,
        COUNT(*) AS quantity,
        SUM(volume) AS total_volume
        FROM bloodUnit
        WHERE status = 1 -- Only in-stock units
        GROUP BY bloodType, rhesus
        ORDER BY bloodType, rhesus;`;

    const { rows } = await conn.query(getQuery);

    res.status(200).json({
      message: "Succesfully get all blood stocks available!",
      data: rows,
    });
  } catch (error) {
    res.status(400).message({
      message: "Failed to get blood stocks data!",
      error: error,
    });
  }
});

/**
 * @swagger
 * /stock/type:
 *   get:
 *     summary: Get blood stock information by type and rhesus
 *     description: Retrieves aggregated blood stock information for a specific blood type and rhesus factor
 *     tags:
 *       - Blood Stocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - rhesus
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [O, A, B, AB]
 *                 description: Blood type
 *                 example: "A"
 *               rhesus:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Rhesus factor
 *                 example: "+"
 *     responses:
 *       200:
 *         description: Successfully retrieved blood stocks by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully get all blood stocks available!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bloodType:
 *                         type: string
 *                         enum: [O, A, B, AB]
 *                         example: "A"
 *                       rhesus:
 *                         type: string
 *                         enum: ["+", "-"]
 *                         example: "+"
 *                       quantity:
 *                         type: integer
 *                         example: 5
 *                       total_volume:
 *                         type: number
 *                         format: float
 *                         example: 2250
 *       400:
 *         description: Failed to get blood stocks by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get blood stocks data!"
 *                 error:
 *                   type: string
 */
router.get("/type", async (req, res) => {
  const { type, rhesus } = req.body;
  try {
    const getQuery = `SELECT 
        bloodType,
        rhesus,
        COUNT(*) AS quantity,
        SUM(volume) AS total_volume
        FROM bloodUnit
        WHERE status = 1 AND bloodType = $1 AND rhesus = $2
        GROUP BY bloodType, rhesus;`;

    const { rows } = await conn.query(getQuery, [type, rhesus]);

    res.status(200).json({
      message: "Succesfully get all blood stocks available!",
      data: rows,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to get blood stocks data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Get all blood units
 *     description: Retrieves information for all blood units (single donor)
 *     tags:
 *       - Blood Units
 *     responses:
 *       200:
 *         description: Successfully retrieved all blood units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully Fetched all blood unit data!"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BloodUnit'
 *       400:
 *         description: Failed to get blood units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get all blood unit data!"
 *                 error:
 *                   type: object
 */
router.get("/", async (req, res) => {
  try {
    const { rows } = await conn.query("SELECT * FROM BLOODUNIT");
    res.status(200).json({
      message: "Succesfully Fetched all blood unit data!",
      data: rows,
    });
  } catch (error) {
    res.status(400).message({
      message: "Failed to get all blood unit data!",
      error: error,
    });
  }
});

/**
 * @swagger
 * /stock/{id}:
 *   get:
 *     summary: Get blood unit by ID
 *     description: Retrieves a specific blood unit by its ID
 *     tags:
 *       - Blood Units
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blood unit ID
 *     responses:
 *       200:
 *         description: Successfully retrieved blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully Fetched a blood unit data!"
 *                 data:
 *                   $ref: '#/components/schemas/BloodUnit'
 *       404:
 *         description: Blood unit not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blood unit with ID 123 not found."
 *       400:
 *         description: Failed to get blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get a blood unit data!"
 *                 error:
 *                   type: object
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await conn.query(
      "SELECT * FROM BLOODUNIT WHERE id_unit = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Blood unit with ID ${id} not found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully Fetched a blood unit data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).message({
      message: "Failed to get a blood unit data!",
      error: error,
    });
  }
});

/**
 * @swagger
 * /stock:
 *   post:
 *     summary: Create a new blood unit
 *     description: Adds a new blood unit to the database
 *     tags:
 *       - Blood Units
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_donor
 *               - volume
 *               - bloodtype
 *               - rhesus
 *               - status
 *               - expirydate
 *             properties:
 *               id_donor:
 *                 type: integer
 *                 description: Donor ID (foreign key to donor table)
 *                 example: 1
 *               volume:
 *                 type: number
 *                 format: float
 *                 description: Blood volume in ml
 *                 example: 450
 *               bloodtype:
 *                 type: string
 *                 enum: [O, A, B, AB]
 *                 description: Blood type
 *                 example: "A"
 *               rhesus:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Rhesus factor
 *                 example: "+"
 *               status:
 *                 type: integer
 *                 enum: [1, 2]
 *                 description: Status (1=in-stock, 2=out)
 *                 example: 1
 *               expirydate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date of the blood unit
 *                 example: "2025-05-15T00:00:00Z"
 *     responses:
 *       201:
 *         description: Successfully created blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully created a new blood data!"
 *                 data:
 *                   $ref: '#/components/schemas/BloodUnit'
 *       400:
 *         description: Failed to create blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create new blood data!"
 *                 error:
 *                   type: string
 */
router.post("/", async (req, res) => {
  const { id_donor, volume, bloodtype, rhesus, status, expirydate } = req.body;
  const donordate = new Date().toISOString();
  try {
    const insertQuery = `INSERT INTO BLOODUNIT(id_donor, volume, bloodtype, rhesus, status, donordate, expirydate) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const { rows } = await conn.query(insertQuery, [
      id_donor,
      volume,
      bloodtype,
      rhesus,
      status,
      donordate,
      expirydate,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Blood unit with ID ${id} not found.`,
      });
    }

    res.status(201).json({
      message: "Succesfully created a new blood data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create new blood data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /stock/{id}:
 *   put:
 *     summary: Update blood unit
 *     description: Updates an existing blood unit by ID
 *     tags:
 *       - Blood Units
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blood unit ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_donor
 *               - volume
 *               - bloodtype
 *               - rhesus
 *               - status
 *               - expirydate
 *             properties:
 *               id_donor:
 *                 type: integer
 *                 description: Donor ID (foreign key to donor table)
 *                 example: 1
 *               volume:
 *                 type: number
 *                 format: float
 *                 description: Blood volume in ml
 *                 example: 450
 *               bloodtype:
 *                 type: string
 *                 enum: [O, A, B, AB]
 *                 description: Blood type
 *                 example: "A"
 *               rhesus:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Rhesus factor
 *                 example: "+"
 *               status:
 *                 type: integer
 *                 enum: [1, 2]
 *                 description: Status (1=in-stock, 2=out)
 *                 example: 1
 *               expirydate:
 *                 type: string
 *                 format: date-time
 *                 description: Expiration date of the blood unit
 *                 example: "2025-05-15T00:00:00Z"
 *     responses:
 *       200:
 *         description: Successfully updated blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully updated a blood data!"
 *                 data:
 *                   $ref: '#/components/schemas/BloodUnit'
 *       404:
 *         description: Blood unit not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blood unit with ID 123 not found."
 *       400:
 *         description: Failed to update blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update blood data!"
 *                 error:
 *                   type: string
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_donor, volume, bloodtype, rhesus, status, expirydate } = req.body;
  const donordate = new Date().toISOString();

  try {
    const updateQuery = `UPDATE BLOODUNIT
            SET id_donor = $1,
                volume = $2,
                bloodtype = $3,
                rhesus = $4,
                status = $5,
                donordate = $6,
                expirydate = $7
            WHERE id_unit = $8
                RETURNING *;`;

    const { rows } = await conn.query(updateQuery, [
      id_donor,
      volume,
      bloodtype,
      rhesus,
      status,
      donordate,
      expirydate,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Blood unit with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      message: "Succesfully updated a blood data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update blood data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /stock/{id}:
 *   delete:
 *     summary: Delete blood unit
 *     description: Deletes a blood unit by ID
 *     tags:
 *       - Blood Units
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blood unit ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Succesfully deleted a blood data!"
 *                 data:
 *                   $ref: '#/components/schemas/BloodUnit'
 *       404:
 *         description: Blood unit not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blood unit with ID 123 not found."
 *       400:
 *         description: Failed to delete blood unit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete a blood data!"
 *                 error:
 *                   type: string
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await conn.query(
      `DELETE FROM BLOODUNIT WHERE id_unit = $1 RETURNING *`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: `Blood unit with ID ${id} not found.`,
      });
    }
    res.status(200).json({
      message: "Succesfully deleted a blood data!",
      data: rows[0],
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete a blood data!",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     BloodUnit:
 *       type: object
 *       properties:
 *         id_unit:
 *           type: integer
 *           description: The unique identifier for the blood unit
 *           example: 1
 *         id_donor:
 *           type: integer
 *           description: The donor's identifier (foreign key)
 *           example: 1
 *         volume:
 *           type: number
 *           format: float
 *           description: Volume of blood in ml
 *           example: 450
 *         bloodType:
 *           type: string
 *           enum: [O, A, B, AB]
 *           description: Blood type
 *           example: "A"
 *         rhesus:
 *           type: string
 *           enum: ["+", "-"]
 *           description: Rhesus factor
 *           example: "+"
 *         status:
 *           type: integer
 *           enum: [1, 2]
 *           description: Status (1=in-stock, 2=out)
 *           example: 1
 *         donorDate:
 *           type: string
 *           format: date-time
 *           description: Date when blood was donated
 *           example: "2025-05-10T10:00:00Z"
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiration date of the blood unit
 *           example: "2025-06-10T10:00:00Z"
 */

module.exports = router;
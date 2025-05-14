/**
 * @swagger
 * tags:
 *   name: Donors
 *   description: Blood donor management
 */

const express = require('express');
const router = express.Router();
const {conn} = require('../database');

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Get all donors
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Fetched All Donor Data!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Donor'
 *       404:
 *         description: No donors found
 *       500:
 *         description: Server error
 */
router.get('/', async(req,res) => {
    try {
        const {rows} = await conn.query('SELECT * FROM DONOR');
        if (rows.length === 0) {
            return res.status(404).json({
              message: `Donor data not found.`,
            });
          }
        res.status(200).json({
            message : "Succesfully Fetched All Donor Data!",
            data : rows
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @swagger
 * /donors/{id}:
 *   get:
 *     summary: Get donor by ID
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the donor
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfuly Fetch Donor ID
 *                 data:
 *                   $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async(req,res) => { 
    try {
        const {id} = req.params;
        const {rows} = await conn.query(`SELECT * FROM DONOR where id_donor = $1`,[id]);

        if (rows.length === 0) {
            return res.status(404).json({
              message: `Donor data with ${id} not found.`,
            });
          }

        res.status(200).json({
            message : "Successfuly Fetch Donor ID",
            data : rows[0]
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/**
 * @swagger
 * /donors:
 *   post:
 *     summary: Create a new donor
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonorInput'
 *     responses:
 *       201:
 *         description: Donor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully created new donor!
 *                 data:
 *                   $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    const { firstName, lastName, email, city, province, bloodType, phoneNumber, lastDonorDate } = req.body;    
    try {
        const insertQuery = `
            INSERT INTO donor 
            (firstname, lastname, email, city, province, bloodtype, phonenumber, lastdonordate) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const { rows } = await conn.query(insertQuery, [
            firstName, lastName, email, city, province, bloodType, phoneNumber, lastDonorDate
        ]);
        
        res.status(201).json({
            message: 'Successfully created new donor!',
            data: rows[0]
        });
        
    } catch (error) {
        console.error('Error creating donor:', error);
        res.status(400).json({
            message: 'Error creating donor',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /donors/{id}:
 *   put:
 *     summary: Update a donor
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the donor to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonorInput'
 *     responses:
 *       200:
 *         description: Donor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Updated donor!
 *                 data:
 *                   $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Donor not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:id', async(req,res)=> {
    const {id} = req.params
    const { firstName, lastName, email, city, province, bloodType, phoneNumber, lastDonorDate } = req.body;
    try {
        const updateQuery = `UPDATE DONOR
                                SET 
                            firstname = $1,
                            lastname = $2,
                            email = $3,
                            city = $4,
                            province = $5,
                            bloodType = $6,
                            phoneNumber = $7,
                            lastdonordate = $8
                            WHERE id_donor = $9
                            RETURNING *
                            `
        const {rows} = await conn.query(updateQuery, [firstName, lastName, email, city, province, bloodType, phoneNumber, lastDonorDate, id]);

        if (rows.length === 0) {
            return res.status(404).json({
              message: `Donor data with ${id} not found.`,
            });
          }

        res.status(200).json({
            message : "Successfully Updated donor!",
            data:rows[0]
        });
    } catch (error) {
        console.error('Error when updating donor : ', error);
        res.status(400).json({
            message : 'Error when updating donor!',
            error:  error.message
        })
    }
});

/**
 * @swagger
 * /donors/{id}:
 *   delete:
 *     summary: Delete a donor
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the donor to delete
 *     responses:
 *       200:
 *         description: Donor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully Deleted donor!
 *                 data:
 *                   $ref: '#/components/schemas/Donor'
 *       404:
 *         description: Donor not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.delete('/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {rows} = await conn.query('DELETE FROM DONOR where id_donor = $1',[id]);

        if (rows.length === 0) {
            return res.status(404).json({
              message: `Donor data with ${id} not found.`,
            });
          }
    
        res.status(200).json({
            message : "Succesfully Deleted donor!",
            data: rows[0]
        })
    } catch (error) {
        console.error('Error when Deleting : ', error);
        res.status(400).json({
            message : 'Error when Deleting donor!',
            error:  error.message
        })
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Donor:
 *       type: object
 *       properties:
 *         id_donor:
 *           type: integer
 *           example: 1
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         city:
 *           type: string
 *           example: New York
 *         province:
 *           type: string
 *           example: NY
 *         bloodType:
 *           type: string
 *           enum: [O, A, B, AB]
 *           example: A
 *         phoneNumber:
 *           type: string
 *           example: "+1234567890"
 *         lastDonorDate:
 *           type: string
 *           format: date
 *           example: "2023-05-15"
 *     DonorInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - city
 *         - province
 *         - bloodType
 *         - phoneNumber
 *         - lastDonorDate
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         city:
 *           type: string
 *           example: New York
 *         province:
 *           type: string
 *           example: NY
 *         bloodType:
 *           type: string
 *           enum: [O, A, B, AB]
 *           example: A
 *         phoneNumber:
 *           type: string
 *           example: "+1234567890"
 *         lastDonorDate:
 *           type: string
 *           format: date
 *           example: "2023-05-15"
 */

module.exports = router;
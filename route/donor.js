const express = require('express');
const router = express.Router();
const {conn} = require('../database');

// get all donors
router.get('/', async(req,res) => {
    try {
        const {rows} = await conn.query('SELECT * FROM DONOR');
        res.status(200).json({data : rows})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// get donors by id
router.get('/:id', async(req,res) => { 
    try {
        const {id} = req.params;
        const {rows} = await conn.query(`SELECT * FROM DONOR where id_donor = $1`,[id]);
        res.status(200).json({data : rows[0]})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// get donors by criteria
router.get('/search/:params', (req,res) => {

});

// post new donors
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

// update donors
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

// delete donors
router.delete('/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {rows} = await conn.query('DELETE FROM DONOR where id_donor = $1',[id]);
    
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

module.exports = router;
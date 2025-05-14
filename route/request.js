const express = require("express");
const router = express.Router();
const { conn } = require("../database");

// get all request
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

// get request by id
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

// post new request
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

//update request
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

// delete request
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

module.exports = router;

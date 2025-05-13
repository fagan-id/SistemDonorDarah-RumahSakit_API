const express = require("express");
const router = express.Router();
const { conn } = require("../database");

// get all blood-stocks (agregasi dari blood_type)
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

// get blood-stocks by id/type
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

// get all blood unit (single donor)
router.get('/',async(req,res) => {
    try {
        const {rows} = await conn.query('SELECT * FROM BLOODUNIT');
        res.status(200).json({
            message : "Succesfully Fetched all blood unit data!",
            data : rows
        })
    } catch (error) {
        res.status(400).message({
            message: "Failed to get all blood unit data!",
            error: error,
          });
    }
});

// get blood unit by id(single donor)
router.get('/:id',async(req,res) => {
    const {id} = req.params
    try {
        const {rows} = await conn.query('SELECT * FROM BLOODUNIT WHERE id_unit = $1',[id]);
        res.status(200).json({
            message : "Succesfully Fetched a blood unit data!",
            data : rows[0]
        })
    } catch (error) {
        res.status(400).message({
            message: "Failed to get a blood unit data!",
            error: error,
          });
    }
});

// post new blood unit (membuat blood unit baru)
router.post("/", async (req, res) => {
  const { id_donor, volume, bloodtype, rhesus, status, donordate, expirydate } =
    req.body;
  try {
    const insertQuery = `INSERT INTO BLOODUNIT(id_donor, volume, bloodtype, rhesus, status, donordate, expirydate) 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    const { rows } = await conn.query(insertQuery, [
      id_donor,
      volume,
      bloodtype,
      rhesus,
      status,
      donordate,
      expirydate,
    ]);

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

// update blood unit
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_donor, volume, bloodtype, rhesus, status, donordate, expirydate } =
    req.body;

  try {
    const updateQuery = `UPDATE BLOODUNIT
            SET id_donor = $1,
                volume = $2,
                bloodtype = $3,
                rhesus = $4,
                status = $5,
                donordate = $6,
                expirydate = $7
            WHERE id_unit = $8;`;

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

// delete blood unit
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await conn.query(
      `DELETE FROM BLOODUNIT WHERE id_unit = $1`,
      [id]
    );
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

module.exports = router;

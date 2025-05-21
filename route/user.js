const express = require("express");
const router = express.Router();
const { conn } = require("../database");

router.get("/", async (req, res) => {
  try {
    const { rows } = conn.query("SELECT * FROM USERS");

    if (rows.length === 0) {
      return res.status(404).json({
        message: `Users data is empty.`,
      });
    }
    res.status(200).json({
        message : "Successfully Fetched Users Data!",
        data : rows
    });

  } catch (error) {
    res.status(404).json({
        message : "Failed to fetch users data!",
        error : error.message
    })
  }
});

module.exports = router;
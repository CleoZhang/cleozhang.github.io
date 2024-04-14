const express = require('express');
const router = express.Router();
const { BusinessUnits } = require('../models')

// Get all business units
router.get("/all", async (_, res) => res.json(await BusinessUnits.findAll()));

// Create a single business unit
router.post("/", async (req, res) => {
    await BusinessUnits.create(req.body);
    console.log(`Created business unit ${req.body.name}`);
    res.json(await BusinessUnits.findAll());
});

// Update a single business unit
router.post("/update", async (req, res) => {
    await BusinessUnits.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated business unit ${req.body.id}`);
    res.json(await BusinessUnits.findAll());
});

// Delete a single business unit by ID
router.delete("/", async (req, res) => {
    await BusinessUnits.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted business unit ${req.body.id}`);
    res.json(await BusinessUnits.findAll());
})


module.exports = router
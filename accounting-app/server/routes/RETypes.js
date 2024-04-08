const express = require('express');
const router = express.Router();
const { RETypes } = require('../models')

// Get all RE types
router.get("/all", async (_, res) => res.json(await RETypes.findAll()));

// Create a single RE type
router.post("/", async (req, res) => {
    await RETypes.create(req.body);
    console.log(`Created RE type ${req.body.name}`);
    res.json(await RETypes.findAll());
});

// Update a single RE type
router.post("/update", async (req, res) => {
    await RETypes.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated RE type ${req.body.id}`);
    const updatedRETypes = await RETypes.findAll();
    res.json(updatedRETypes);
});

// Delete a single RE type by ID
router.delete("/", async (req, res) => {
    await RETypes.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted RE type ${req.body.id}`);
    res.json(await RETypes.findAll());
})


module.exports = router
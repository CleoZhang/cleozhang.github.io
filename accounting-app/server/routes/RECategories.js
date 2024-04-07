const express = require('express');
const router = express.Router();
const { RECategories } = require('../models')

// Get all RE categories
router.get("/all", async (_, res) => res.json(await RECategories.findAll()));

// Create a single RE category
router.post("/", async (req, res) => {
    await RECategories.create(req.body);
    console.log(`Created RE category ${req.body.name}`);
    res.json(await RECategories.findAll());
});

// Update a single RE category
router.post("/update", async (req, res) => {
    await RECategories.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated RE category ${req.body.id}`);
    const updatedRECategories = await RECategories.findAll();
    res.json(updatedRECategories);
});

// Delete a single RE category by ID
router.delete("/", async (req, res) => {
    await RECategories.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted RE category ${req.body.id}`);
    res.json(await RECategories.findAll());
})


module.exports = router
const express = require('express');
const router = express.Router();
const { PayableCategories } = require('../models')

// Get all payable categories
router.get("/all", async (_, res) => res.json(await PayableCategories.findAll()));

// Create a single payable category
router.post("/", async (req, res) => {
    await PayableCategories.create(req.body);
    console.log(`Created payable category ${req.body.name}`);
    res.json(await PayableCategories.findAll());
});

// Update a single payable category
router.post("/update", async (req, res) => {
    await PayableCategories.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated payable category ${req.body.id}`);
    const updatedPayableCategories = await PayableCategories.findAll();
    res.json(updatedPayableCategories);
});

// Delete a single payable category by ID
router.delete("/", async (req, res) => {
    await PayableCategories.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted payable category ${req.body.id}`);
    res.json(await PayableCategories.findAll());
})


module.exports = router
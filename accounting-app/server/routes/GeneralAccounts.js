const express = require('express');
const router = express.Router();
const { GeneralAccounts } = require('../models')

// Get all general accounts
router.get("/all", async (_, res) => res.json(await GeneralAccounts.findAll()));

// Create a single general account
router.post("/", async (req, res) => {
    await GeneralAccounts.create(req.body);
    console.log(`Created general account ${req.body.name}`);
    res.json(await GeneralAccounts.findAll());
});

// Update a single general account
router.post("/update", async (req, res) => {
    await GeneralAccounts.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated general account ${req.body.id}`);
    const updatedGeneralAccounts = await GeneralAccounts.findAll();
    res.json(updatedGeneralAccounts);
});

// Delete a single general account by ID
router.delete("/", async (req, res) => {
    await GeneralAccounts.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted general account ${req.body.id}`);
    res.json(await GeneralAccounts.findAll());
})


module.exports = router
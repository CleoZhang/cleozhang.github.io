const express = require('express');
const router = express.Router();
const { GeneralLedgerEntries } = require('../models')

// Get all general ledger entries
router.get("/all", async (_, res) => res.json(await GeneralLedgerEntries.findAll()));

// Create a single general ledger entry
router.post("/", async (req, res) => {
    await GeneralLedgerEntries.create(req.body);
    console.log(`Created general ledger entry ${req.body.name}`);
    res.json(await GeneralLedgerEntries.findAll());
});

// Update a single general ledger entry
router.post("/update", async (req, res) => {
    await GeneralLedgerEntries.update(req.body, {
        where: {
            id: req.body.id
        }
    });
    console.log(`Updated general ledger entry ${req.body.id}`);
    const updatedGeneralLedgerEntries = await GeneralLedgerEntries.findAll();
    res.json(updatedGeneralLedgerEntries);
});

// Delete a single general ledger entry by ID
router.delete("/", async (req, res) => {
    await GeneralLedgerEntries.destroy({
        where: {
            id: req.body.id
        }
    });
    console.log(`Deleted general ledger entry ${req.body.id}`);
    res.json(await GeneralLedgerEntries.findAll());
})


module.exports = router
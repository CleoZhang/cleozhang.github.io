const express = require('express');
const router = express.Router();
const { Projects } = require('../models')

// Get all projects
router.get("/all", async (_, res) => res.json(await Projects.findAll()));

// Delete all projects
router.delete("/all", async (_, res) => {
    await Projects.truncate();
    console.log("All projects deleted.")
    const allProjects = await Projects.findAll();
    res.json(allProjects);
})

// Get a single project by ID
router.get("/", async (req, res) => {
    const project = await Projects.findAll({
        where: {
            id: req.body.id
        }
    });
    res.json(project);
});

// Create a single project
// router.post("/", async (req, res) => res.json(await Projects.create(req.body)))
router.post("/", async (req, res) => {
    await Projects.create(req.body);
    res.json(await Projects.findAll());
});

// Delete a single project by ID
router.delete("/", async (req, res) => {
    await Projects.destroy({
        where: {
            id: req.body.id
        }
    });
    res.json(await Projects.findAll());
})

// Create projects in bulk
router.post("/bulk", async (req, res) => {
    await Projects.bulkCreate(req.body);
    res.json(await Projects.findAll());
})

// Delete projects in bulk
router.delete("/bulk", async (req, res) => {
    await Projects.destroy( {
        where: { id: req.body.map(i => i.id) }
    });
    res.json(await Projects.findAll());
})

module.exports = router
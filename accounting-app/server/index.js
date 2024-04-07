const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require('./models');

// Routers - app.use(route, router)
app.use("/users", require('./routes/Users'))
app.use("/projects", require('./routes/Projects'))
app.use("/recategories", require('./routes/RECategories'))

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
})

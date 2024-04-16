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
app.use("/retypes", require('./routes/RETypes'))
app.use("/generalaccounts", require('./routes/GeneralAccounts'))
app.use("/businessunits", require('./routes/BusinessUnits'))
app.use("/payablecategories", require('./routes/PayableCategories'))
app.use("/generalledgerentries", require('./routes/GeneralLedgerEntries'))

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001");
    });
})

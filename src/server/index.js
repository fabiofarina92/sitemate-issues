const express = require("express");
const bodyParser = require("body-parser");
const issuesRoute = require('./issues/issues.routes')

const app = express();
app.use(bodyParser.json());
app.use('/issues', issuesRoute);

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

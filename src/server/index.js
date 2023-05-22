const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Sample data
let issues = [
    { id: 1, title: 'Connection Issue', created_by: 'John Smith', description: 'There is a connection issue' },
    { id: 2, title: 'Functionality Issue', created_by: 'Jane Smith', description: `There's an issue when blah happens` },
    { id: 3, title: 'Visual Issue', created_by: 'John Smith', description: `I don't like the colour red` },
    { id: 4, title: 'Feature Request', created_by: 'Fabio Farina', description: `Add a client` },
];

// GET all issues
app.get('/issues', (req, res) => {
    res.json(issues);
});

// GET a specific issue by ID
app.get('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issue = issues.find((issue) => issue.id === id);
    if (issue) {
        res.status(200).json(issue);
    } else {
        res.status(404).send(`Issue ${id} not found`);
    }
});

// CREATE a new issue
app.post('/issues', (req, res) => {
    const highestId = issues.reduce((prev, curr) => {
        return prev.id > curr.id ? prev : curr;
    })

    const { title, created_by, description } = req.body;
    const newIssue = { id: highestId.id + 1, title, created_by, description };
    issues.push(newIssue);
    console.log(`New issue created:`, newIssue);
    res.status(201).json(newIssue);
});

// UPDATE an issue by ID
app.put('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, created_by, description  } = req.body;
    const issue = issues.find((issue) => issue.id === id);
    if (issue) {
        issue.title = title;
        issue.created_by = created_by;
        issue.description = description;
        console.log(`Updated issue: `, issue);
        res.status(201).json(issue);
    } else {
        res.status(404).send('Issue not found');
    }
});

// DELETE an issue by ID
app.delete('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issueIndex = issues.findIndex((issue) => issue.id === id);
    if (issueIndex !== -1) {
        const deleteIssue = issues.splice(issueIndex, 1);
        console.log(`Deleted issue: `, deleteIssue[0])
        res.status(201).json(deleteIssue[0]);
    } else {
        res.status(404).send('Issue not found');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

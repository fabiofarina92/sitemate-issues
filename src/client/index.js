const { prompt } = require('enquirer');
const axios = require('axios');

async function main() {
    const request = await prompt([{
        type: "select",
        name: "action",
        message: "Pick the action you would like to take",
        choices: ["Create", "Read", "Update", "Delete", "Quit"]
    }])

    switch (request.action) {
        case "Create":
            console.log("Executing Create")
            await createIssue();
            break;
        case "Read":
            console.log("Executing Read")
            await readIssue();
            break;
        case "Update":
            console.log("Executing Update")
            await updateIssue();
            break;
        case "Delete":
            console.log("Executing Delete")
            await deleteIssue()
            break;
    }

    if (request.action !== "Quit") {
        await main()
    }
}

async function retrieveAllIssues() {
    let allIssues = await axios.get('http://localhost:3000/issues');
    return allIssues.data;
}


async function promptIssue() {
    return prompt({
        type: "select",
        name: "issueId",
        message: "Pick your desired issue",
        choices: (await retrieveAllIssues()).map(({ id, title }) => ({ name: id, message: `${id}: ${title}` }))
    });
}

async function createIssue() {
    const newIssue = await prompt([{
        name: "title", type: "input", message: "What should the new title be?"
    }, {
        name: "created_by", type: "input", message: "Who created the issue: "
    }, {
        name: "description", type: "input", message: "What is the description"
    }])

    let response = await axios.post(`http://localhost:3000/issues/`, newIssue);

    if (response.status === 201) {
        console.log("Issue created successfully");
    } else {
        console.log("Something went wrong");
    }
}


async function readIssue() {
    const issue = await promptIssue();

    let response = await axios.get(`http://localhost:3000/issues/${issue.issueId}`);

    if (response.status === 200) {
        console.log(`Issue Number: ${response.data.id}`)
        console.log(`Issue Title: ${response.data.title}`)
        console.log(`Issue Raised By: ${response.data.created_by}`)
        console.log(`Issue Number: ${response.data.description}`)
        console.log("Issue created successfully");
    } else {
        console.log("Something went wrong");
    }

}

async function updateIssue() {
    const issue = await promptIssue();

    let requestIssue = await axios.get(`http://localhost:3000/issues/${issue.issueId}`);

    const updatedIssue = await prompt([{
        name: "title", type: "input", message: "What should the new title be?", initial: requestIssue.data.title
    }, {
        name: "created_by", type: "input", message: "Who created the issue: ", initial: requestIssue.data.created_by
    }, {
        name: "description", type: "input", message: "What is the description", initial: requestIssue.data.description
    }])

    let response = await axios.put(`http://localhost:3000/issues/${requestIssue.data.id}`, updatedIssue);

    if (response.status === 201) {
        console.log("Issue updated successfully");
    } else {
        console.log("Something went wrong");
    }
}

async function deleteIssue() {
    const issue = await promptIssue();

    let requestIssue = await axios.get(`http://localhost:3000/issues/${issue.issueId}`);

    const confirm = await prompt({
        name: "delete",
        type: "confirm",
        message: `Please confirm that you would like to delete: Issue ${requestIssue.data.id} - ${requestIssue.data.title}`
    })

    if (confirm.delete) {
        let response = await axios.delete(`http://localhost:3000/issues/${requestIssue.data.id}`)
        if (response.status === 201) {
            console.log("Issue was successfully deleted");
        } else {
            console.log("Something went wrong");
        }
    }

}

main();

const Project = require("../models/projects.model");

// TODO: complete the code as per the instructions given in Assignment 4

let dateRegex = /^([1-9]\d{3}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01])[\ ]([01]?[0-9]|2[0-3]):[0-5][0-9])$/;
let mName =  "Name (key=name, value=<project-name>) ";
let mDescription = "Description (key=description, value=<project-description>) ";
let mStartDate = "Start Date (key = startDate, value = <start-date: yyyy-MM-dd HH:mm>) ";
let mEndDate = "End Date (key = endDate, value = <end-date: yyyy-MM-dd HH:mm>) ";

/**
 * This method checks if there are valid keys in the request. If there valid keys then
 * false is returned as the body is valid.
 * @param {object} body The body of the request
 * @returns boolean
 */
 const invalidBody = (body) => {
    if('name' in body || 'description' in body || 'startDate' in body || 'endDate' in body) return false;
    return true;
}

/**
 * This method checks if the variable is valid.
 * @param {variable} variable The variable/value to be checked 
 * @returns boolean 
 */
const invalidVariable = (variable) => {
    if(variable === undefined || variable === '' || variable.trim().length === 0) return true;
    return false;
}

/**
 * This method replaces ' with ''.
 * @param {string} data Data to format
 * @returns data
 */
const formatData = (data) => { 
    if(data !== undefined && data !== null){
        data = data.replace("'", "''");
        return data;
    }
    return undefined;
}

/**
 * This method handles a GET request for all the projects in the database.
 * If valid, it will responsed with the data else it will show an error.
 * @param {request} req Request
 * @param {response} res Response of the system
 */
exports.getProjectEntries = (req, res) => {
    Project.getAll((err, data) => {
        if(err) {
            res.status(500).send({
                message : "Internal server error occured while trying to get a list of all projects"
            });
        } else {
            res.status(200).send(data);
        }
    });
};

/**
 * This method handles a GET request for a project with the id specified.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 * @param {number} id Id of the project to GET
 */
exports.getProjectEntryById = (req, res, id) => {
    Project.getProjectById((err, data) => {
        //an error has occured in the server while retrieving the data
        if(err) {
            res.status(500).send({
                message : "Internal server error occured when retriving a project with an id of " + id
            });
        } 
        //no project with the specific id
        else if(data == null){
            res.status(404).send({
                message : "There is no project with an id of " + id
            });
        }
        else {
            res.status(200).send(data);
        }
    }, id);
};

/**
 * This method handles a GET request for a project with the name specified.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 * @param {string} name Name of project
 */
exports.getProjectEntryByName = (req, res, name) => {
    Project.getProjectByName((err, data) => {
        //error occured in the database
        if(err) {
            res.status(500).send({
                message : "Internal server error occured when retriving project(s) named " + name
            });
        } 
        //no project(s) was retreived from the database.
        else if(data.length == 0){
            res.status(404).send({
                message : "There is no project(s) named " + name
            });
        }
        else {
            res.status(200).send(data);
        }
    }, name);
};

/**
 * This method creates a new project with the values specified in the request body.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 * @returns 
 */
exports.createProjectEntry = (req, res) => {

    //check if the any data was passed in
    if(invalidBody(req.body)){
        res.status(400).send({
            message: "Please provide a project name, description, start date and end date"
        });
        return;
    }
    //validate data passed in
    var message = "Please provide Project: ";  
    if(invalidVariable(req.body.name)) message += mName;    
    if(invalidVariable(req.body.description)) message += mDescription;
    if(invalidVariable(req.body.startDate) || !dateRegex.test(req.body.startDate)) message += mStartDate;
    if(invalidVariable(req.body.endDate) || !dateRegex.test(req.body.endDate)) message += mEndDate;

    //check if the end date is valid, should be after the start date
    var startD = new Date(req.body.startDate);
    var endD = new Date(req.body.endDate);
    if(endD.getTime() <= startD.getTime()) message += "End date, date is before start date.";

    //data is valid, create a new project
    if(message === "Please provide Project: "){
        let project = new Project(formatData(req.body.name), formatData(req.body.description), formatData(req.body.startDate), formatData(req.body.endDate));        
        Project.createProject((err, data) => {
            if(err){
                res.status(500).send({
                    message: "Internal server error occured while creating a new project"
                });
            } else {
                res.sendStatus(201);
            }
        }, project);
    } 
    //bad request as the data was not valid
    else {
        res.status(400).send({
            message: message
        });
    }
};

/**
 * This method updates an existing project matching the id with the values specified.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 * @returns 
 */
exports.updateProjectEntryById = (req, res) => {

    //check there are valid keys passed in the request
    if(invalidBody(req.body)){
        res.status(400).send({
            message: "Please provide any of the following, project id, name, description, start date or end date"
        });
        return;
    }
    //check the keys passed in.
    var message = "Please provide Project: "; 
    if(req.body.id === undefined) message += "Id (key=id, value=<project-id>) ";
    if(req.body.name !== undefined) if(invalidVariable(req.body.name)) message += mName;
    if(req.body.description !== undefined) if(invalidVariable(req.body.description)) message += mDescription;
    if(req.body.startDate !== undefined) if(invalidVariable(req.body.startDate) || !dateRegex.test(req.body.startDate)) message += mStartDate;
    if(req.body.endDate !== undefined) if(invalidVariable(req.body.endDate) || !dateRegex.test(req.body.endDate)) message += mEndDate;

    //valid, create a new project object and update the project specified
    if(message === "Please provide Project: "){
        let project = new Project(formatData(req.body.name), formatData(req.body.description), formatData(req.body.startDate), formatData(req.body.endDate));        
        Project.updateProject((err, data) => {
            if(err){
                res.status(500).send({
                    message: "Internal server error"
                });
            } 
            //check if a project matched the id
            else if(data.affectedRows === 0){
                res.status(404).send({
                    message: "No project matched id " + req.body.id
                });
            }
            else {
                res.sendStatus(204);
            }
        }, req.body.id, project);
    } 
    //request was not valid
    else {
        res.status(400).send({
            message: message
        });
    }
};

/**
 * This method deletes a project which matches the id specified.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 * @param {number} id Id of the project
 */
exports.deleteProjectEntryById = (req, res, id) => {
    Project.deleteProjectById((err, data) => {
        //interal server error
        if(err) {
            res.status(500).send({
                message : "Internal server error occured while deleteing a project matching the id of " + id
            });
        } 
        //there was no project to delete
        else if(data.affectedRows === 0){
            res.status(404).send({
                message : "There is no project with an id of " + id
            });
        }
        else {
            res.sendStatus(204);
        }
    }, id);
};

/**
 * This method deletes all the projects.
 * @param {request} req Request of the user
 * @param {response} res Response of the system
 */
exports.deleteProjectEntries = (req, res) => {
    Project.deleteAll((err, data) => {
        if(err) {
            res.status(500).send({
                message : "Internal server error occured while deleting all the projects"
            });
        }
        else {
            res.sendStatus(204);
        }
    });
};
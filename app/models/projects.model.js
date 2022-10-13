const db = require("./db");

// TODO: complete the code as per the instructions given in Assignment 4
const TABLE = "projects";

/**
 * This is a constructor for a project object
 * @param {string} name Name of the project
 * @param {string} description Description of the project
 * @param {string} startDate Start date of the project. Format yyyy-MM-dd HH:mm
 * @param {string} endDate End date of the project. Format yyyy-MM-dd HH:mm
 */
const Project = function(name, description, startDate, endDate) {
  this.name = name;
  this.description = description;
  this.startDate = startDate;
  this.endDate = endDate;
};

/**
 * This method queries the database to create a new project with the data from the project object.
 * @param {method} resultCallback The method that will execute after the query
 * @param {Project} project The project object
 */
Project.createProject = (resultCallback, project) => {
  var sql = "INSERT INTO `"+TABLE+"`(`projectname`, `projectdesc`, `startdate`, `enddate`)";
  sql += " VALUES ('"+project.name+"','"+project.description+"','"+project.startDate+"','"+project.endDate+"'); ";

  executeQuery(sql, resultCallback);
};

/**
 * This method queries the database to get all the projects.
 * @param {method} resultCallback Callback funtion that will execute after the query
 */
Project.getAll = (resultCallback) => {
  var sql = "SELECT * FROM `"+TABLE+"`";
  selectQuery(sql, resultCallback, []);
};

/**
 * This method selects a project by the id.
 * @param {method} resultCallback Callback function
 * @param {number} id Id of the project to be queried
 */
Project.getProjectById = (resultCallback, id) => {
  var sql = "SELECT * FROM `"+TABLE+"` WHERE id = " + id;
  selectQuery(sql, resultCallback, null);
};

/**
 * This method selects a project by the name.
 * @param {method} resultCallback Callback function
 * @param {string} projectName Name of the project to be queried
 */
Project.getProjectByName = (resultCallback, projectName) => {
  var sql = "SELECT * FROM `"+TABLE+"` WHERE projectname ='" + projectName + "'";
  selectQuery(sql, resultCallback, []); 
};

/**
 * This method updates the project matching the id specified.
 * @param {method} resultCallback Callback function
 * @param {number} id Id of the project
 * @param {Project} project Project object
 */
Project.updateProject = (resultCallback, id, project) => {
  var sql = "UPDATE `"+TABLE+"` SET ";
  //check the attributes that will be updated
  if(project.name !== undefined) sql += "`projectname`='"+project.name+"',";
  if(project.description !== undefined) sql += "`projectdesc`='"+project.description+"',";
  if(project.startDate != undefined) sql += "`startdate`='"+project.startDate+"',";
  if(project.endDate != undefined) sql += "`enddate`='"+project.endDate+"',";
  
  sql = sql.slice(0, -1) + " ";
  sql += "WHERE id = " + id;  
  executeQuery(sql, resultCallback);
};

/**
 * THis method deletes a project that matches the id specified.
 * @param {method} resultCallback Callback function
 * @param {number} id Id of the project
 */
Project.deleteProjectById = (resultCallback, id) => {
  var sql = "DELETE FROM `"+TABLE+"` WHERE id = " + id;
  executeQuery(sql, resultCallback);
};

/**
 * This method deletes all the projects.
 * @param {method} resultCallback Callback function
 */
Project.deleteAll = (resultCallback) => {
  var sql ="truncate `"+TABLE+"`";
  executeQuery(sql, resultCallback);
};

/**
 * This method queries the database depending on the query passed in.
 * The callback function is called after the query is executed.
 * @param {string} sql SQL query
 * @param {method} resultCallback Callback function
 */
const executeQuery = (sql, resultCallback) => {
  db.query(sql, function(err, result) {
    if(err){
      resultCallback(err, null);
    } else {
      resultCallback(null, result);
    }
  });
};

/**
 * This method queries the database and returns either an array of objects or one object.
 * @param {string} sql SQL query
 * @param {method} resultCallback Callback function
 * @param {object} project_entries Project/projects
 */
const selectQuery = (sql, resultCallback, project_entries) => {
  db.query(sql, function(err, result){    
    //check if an error has occured
    if(err){
      resultCallback(err, null);
    } else {
      //loop through all the results 
      for(const project_entry_result of result) {

        //create a new object literal for the project to add to the array
        const project_entry = {
          id: project_entry_result.id,
          name: project_entry_result.projectname,
          description: project_entry_result.projectdesc,
          startDate: project_entry_result.startdate,
          endDate: project_entry_result.enddate
        };

        if(project_entries != null){
          project_entries.push(project_entry);
        } else {
          project_entries = project_entry;
        }     
      }
      //no errors, data to send back
      resultCallback(null, project_entries);
    }
  });
};

module.exports = Project;
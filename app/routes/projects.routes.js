const express = require("express");

module.exports = app => {
  const ProjectsController = require("../controllers/projects.controller");

  // TODO: complete the code as per the instructions given in Assignment 4
  let router = express.Router();

  /**
   * Every route will log the method used.
   */
  router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
  });

  /**
   * Outlines all the possible paths 
   */
  router.get("/", function(req, res){
    res.json({"message" : "API for Projects. GET /projects/   GET /project/id/<project-id>   GET /project/name/<project-name>   POST /project/   PUT /project/   DELETE /project/id/<project-id>   DELETE /projects/"});
  });

  /**
   * GET all the projects.
   * Request: GET http://localhost:3000/api/projects/
   * Response: 
[
    {
        "id": 1,
        "name": "CRM System",
        "description": "CRM (Customer Relationship Management) systems help businesses organize relationships with their customers.",
        "startDate": "2021-02-01 08:00",
        "endDate": "2021-09-30 09:00"
    },
    {
        "id": 2,
        "name": "Heritage New Zealand's Archaeological Reports Digital Library",
        "description": "A Greenstone Digital Library project providing access to Heritage New Zealand's PDF-based Archaeological Report, available through https://www.heritage.org.nz/protecting-heritage/archaeology/digital-library",
        "startDate": "2022-01-01 09:00",
        "endDate": "2022-01-31 24:00"
    },
    {
        "id": 3,
        "name": "Local Charity Goods Alerting System",
        "description": "A mobile app that allows users to register for items they are looking for (such as a stroller), and be alerted when good come in that match the description.",
        "startDate": "2022-02-01 01:00",
        "endDate": "2023-02-28 01:00"
    },
    {
        "id": 4,
        "name": "Hey There, Interact with Me!",
        "description": "A WebSocket based system designed to allow users to control displays in public spaces such as museums and airports using their phones.",
        "startDate": "2020-07-09 07:00",
        "endDate": "2021-01-31 10:00"
    },
    {
        "id": 5,
        "name": "E-Commerce Website for Visually Impaired",
        "description": "An ecommerce website is developed to assist blind people that automatically recognizes clothing patterns and colours.",
        "startDate": "2022-01-01 12:00",
        "endDate": "2022-05-05 12:00"
    }
]
   */
  router.get("/projects/", function(req, res){
    ProjectsController.getProjectEntries(req, res);
  });

  //paths to help the user
  router.get("/project/", function(req, res){
    res.json({"message" : "path: /id/<Project Id>    path: /name/<Project Name>"});
  });
  router.get("/project/id/", function(req, res) {
    res.json({"message" : "/<Project Id>"});
  });
  router.get("/project/name/", function(req, res) {
    res.json({"message" : "/<Project Name>"});
  });

  /**
   * GET project by id.
   * Request: GET http://localhost:3000/api/project/id/1
   * Response
{
    "id": 1,
    "name": "CRM System",
    "description": "CRM (Customer Relationship Management) systems help businesses organize relationships with their customers.",
    "startDate": "2021-02-01 08:00",
    "endDate": "2021-09-30 09:00"
}
   */
  router.get("/project/id/:id", function(req, res) {
    ProjectsController.getProjectEntryById(req, res, req.params.id);
  });

  /**
   * GET project(s) by name.
   * Request: GET http://localhost:3000/api/project/name/CRM System
   * Response
[
    {
        "id": 1,
        "name": "CRM System",
        "description": "CRM (Customer Relationship Management) systems help businesses organize relationships with their customers.",
        "startDate": "2021-02-01 08:00",
        "endDate": "2021-09-30 09:00"
    }
]
   */
  router.get("/project/name/:name", function(req, res) {
    var name = req.params.name.replace("%", " ");
    name = name.replace("'", "''");
    ProjectsController.getProjectEntryByName(req, res, name);
  });

  /**
   * POST project info.
   * Request: POST http://localhost:3000/api/project/
   * name = New Project
   * description = Description of new project.
   * startDate = 2022-06-20 9:00
   * endDate = 2022-07-20 9:00
   * Response: 201
   * Created
   */
  router.post("/project/", function(req, res){
    ProjectsController.createProjectEntry(req, res);
  });

  /**
   * PUT project info.
   * Request: PUT http://localhost:3000/api/project/
   * id = 6
   * name = New Project Editing
   * description = Description of new project, editing
   * Response: 204
   * No content
Request: GET http://localhost:3000/api/project/id/6
Reponse:
{
    "id": 6,
    "name": "New Project Editing",
    "description": "Description of new project, editing",
    "startDate": "2022-06-20 9:00",
    "endDate": "2022-07-20 9:00"
}
   */
  router.put("/project/", function(req, res){
    ProjectsController.updateProjectEntryById(req, res);
  });

  /**
   * DELETE project by id.
   * Request: DELETE http://localhost:3000/api/project/id/6
   * Response: 204
   * No content
   */
  router.delete("/project/id/:id", function(req, res){
    ProjectsController.deleteProjectEntryById(req, res, req.params.id);
  });

/**
 * DELETE all projects.
 * Request: DELETE http://localhost:3000/api/projects/
 * Response: 204
 * No content
Request: GET http://localhost:3000/api/projects/
Response: []
 */
  router.delete("/projects/", function(req, res){
    ProjectsController.deleteProjectEntries(req, res);
  });

  app.use("/api", router);
}
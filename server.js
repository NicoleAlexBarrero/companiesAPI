/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nicole Barrero Student ID: 158270215 Date: 09/13/2023
*  Cyclic Link: https://super-pink-leather-jacket.cyclic.app
*
********************************************************************************/ 

const express = require('express');
const cors = require('cors'); // importing cors package
const CompaniesDB = require('./modules/companiesDB'); // import the companiesDB.js module
const app = express();
const HTTP_PORT = 8080;

// import & configure "dotenv"
require('dotenv').config();
// initialize the companiesDB instance
const db = new CompaniesDB();



// use cors middleware before defining routes, this allows cross-origin requests to server
app.use(cors()); 

// use "express.json()" middleware to parse JSON in the request body
app.use(express.json());

// connect to MongoDB with connection string? //test?
// MONGODB_CONN_STRING= 'mongodb+srv://nbarrero:Cqpxums1HqE3wUre@senecaweb.x5fzslg.mongodb.net/sample_training'




// define a route for "/"
app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

// start server
//app.listen(HTTP_PORT, () => {
  //console.log(`Server is running on port ${HTTP_PORT}`);
//});

//add the routes

// Define route handlers for your API
// POST /api/companies - Add a new company
app.post('/api/companies', async (req, res) => {
    try {
      const newData = req.body;
      const result = await db.addNewCompany(newData);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add a new company' });
    }
  });
  
  // GET /api/companies - Retrieve companies with pagination and optional tag filter
  app.get('/api/companies', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;
      const tag = req.query.tag || '';
  
      const companies = await db.getAllCompanies(page, perPage, tag);
      res.json(companies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve companies' });
    }
  });
  
  // GET /api/company/:name - Retrieve a specific company by name
  app.get('/api/company/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const company = await db.getCompanyByName(name);
      if (!company) {
        res.status(204).json({ error: 'Company not found' });
      } else {
        res.json(company);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve the company' });
    }
  });
  
  // PUT /api/company/:name - Update a specific company by name
  app.put('/api/company/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const newData = req.body;
      const result = await db.updateCompanyByName(newData, name);
      if (!result) {
        res.status(204).json({ error: 'Company not found' });
      } else {
        res.json({ message: 'Company updated successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update the company' });
    }
  });
  
  // DELETE /api/company/:name - Delete a specific company by name
  app.delete('/api/company/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const result = await db.deleteCompanyByName(name);
      if (!result) {
        res.status(204).json({ error: 'Company not found' });
      } else {
        res.json({ message: 'Company deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(204).end(); // .json({ error: 'Failed to delete the company' });
    }
  });
  


  // initialize module before server starts  //move?
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});


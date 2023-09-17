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
const cors = require('cors');
const CompaniesDB = require('./modules/companiesDB'); 
const app = express();
const HTTP_PORT = 8080;


require('dotenv').config();
const db = new CompaniesDB();

app.use(cors()); 

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

// routes
// POST add new company
app.post('/api/companies', (req, res) => {
  db.addNewCompany(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to add new company' });
    });
});

  
  // GET retrieve companies 
app.get('/api/companies', (req, res) => {
  const page = parseInt(req.query.page) || 1; //default to 1 
  const perPage = parseInt(req.query.perPage) || 10;
  const tag = req.query.tag || '';

  db.getAllCompanies(page, perPage, tag)
    .then((companies) => {
      res.json(companies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

  
  // GET retrieve a company by 
  app.get('/api/company/:name', (req, res) => {
   db.getCompanyByName(req.params.name).then((data)=> {
        console.log("Company retrieved");
        res.status(200).json(data);
      }).catch((err)=>{
          res.status(500).json({ error: 'Failed to retrieve company' });
      })
  });
  
  // PUT update a company
  app.put('/api/company/:name', (req, res) => {
      db.updateCompanyByName(req.body, req.params.name).then((data)=> {
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json({ error: 'Failed to update the company' });
    })
  });
  
  // DELETE celete company
  app.delete('/api/company/:name', (req, res) => {
  db.deleteCompanyByName(req.params.name).then((data) => {
      res.status(200).json(data);
    }).catch((err)=>{
      res.status(204).end(); 
    })
  });


  // initialize before server starts 
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});




const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Routes = require('../models/Route');
const { body, validationResult } = require('express-validator');


// Route 1 : Get all the routes using GET "/api/notes/fetchallnotes".Login required.
router.get('/fetchallroutes', fetchuser, async (req, res) => {
    try {
        const routes = await Routes.find({ user: req.user.id })
        res.json(routes)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server error");
    }

})


// Route 2 : Add route in DB
router.post('/addroute',fetchuser, async (req, res) => {
    try {
        // Extract route data from the request body
        const { user, locations } = req.body;

        // Create a new route object
        const newRoute = new Routes({
           
            locations,
            user: req.user.id
        });

        // Save the new route to the database
        const savedRoute = await newRoute.save();

        // Send the saved route as a response
        res.status(201).json(savedRoute);
    } catch (error) {
        // Handle errors
        console.error('Error adding new route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route 3 : Delete a Route By Id

router.delete("/deleteroute/:id",fetchuser,async (req,res)=>{
    try {
        // Find the Route to be deleted and delete it
        let route = await Routes.findById(req.params.id);
        if (!route) { return res.status(404).send("Not found") }
        // Allow Deltetion only if the user own this Route
        if (route.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        route = await Routes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", route: route });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server error");
    }

})

// Route 4 : Update Route by Adding a new Place 



module.exports = router
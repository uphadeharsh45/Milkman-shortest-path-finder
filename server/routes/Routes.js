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
router.put('/updateroute/:id',fetchuser, async (req, res) => {
    const { id } = req.params; // ID of the route
    const { newLocations } = req.body; // New locations array to replace
  
    try {
      // Find the route by ID
      const route = await Routes.findByIdAndUpdate(id, { locations: newLocations }, { new: true });
  
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
  
      res.status(200).json({ message: 'Route updated successfully', route });
    } catch (error) {
      console.error('Error updating route:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Route 5 : to delete a customer from a route
router.delete('/deletecustomer/:routeId/:customerId',fetchuser, async (req, res) => {
    const { routeId, customerId } = req.params;
  
    try {
      // Find the route by ID
      const route = await Routes.findById(routeId);
  
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
  
      // Find the index of the customer in the route's locations array
      const customerIndex = route.locations.findIndex(customer => customer._id == customerId);
  
      if (customerIndex === -1) {
        return res.status(404).json({ message: 'Customer not found in route' });
      }
  
      // Remove the customer from the route's locations array
      route.locations.splice(customerIndex, 1);
  
      // Save the updated route
      await route.save();
  
      res.status(200).json({ message: 'Customer deleted successfully', route });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Route 6: to update the time of a customer in a route
router.put('/updatetime/:routeId/:customerId',fetchuser, async (req, res) => {
    const { routeId, customerId } = req.params;
    const { newTime } = req.body;
  
    try {
      const route = await Routes.findById(routeId);
  
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
  
      const customer = route.locations.find(customer => customer._id == customerId);
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found in route' });
      }
  
      // Update the time of the customer
      customer.time = newTime;
  
      await route.save();
  
      res.status(200).json({ message: 'Customer time updated successfully', route });
    } catch (error) {
      console.error('Error updating customer time:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



module.exports = router
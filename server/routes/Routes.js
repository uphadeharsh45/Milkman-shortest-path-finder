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


// Route 2 : Add a new Route using POST "/api/routes/addroute".Login required.
// router.post('/addroute', fetchuser, [
//     body('title', 'Enter a valid title').isLength({ min: 3 }),
//     body('description', 'Description must be atleast 5 characters').isLength({ min: 3 }),
// ], async (req, res) => {
//     try {
//         const { title, description, tag } = req.body;
//         // Finds the error from a submitted form
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const note = new Notes({
//             title, description, tag, user: req.user.id
//         })
//         const savedNote = await note.save()
//         res.json(savedNote)
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send("Internal Server error");
//     }

// })

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


module.exports = router
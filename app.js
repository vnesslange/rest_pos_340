/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT = 4778;

// Database
var db = require('./database/db-connector');

// Handlebars
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use('/static', express.static('public'));
app.use('/', express.static('public'));


/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM bsg_people;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/Employees', function(req, res)
    {  
        let queryEmployees;

        if (req.query.lastName === undefined)
        {
            queryEmployees = "SELECT * FROM Employees;";      
        }

        else
        {
            query1 = `SELECT * FROM Employees WHERE lastName LIKE "${req.query.lastName}%"`
        }
                

        db.pool.query(queryEmployees, function(error, rows, fields){
                let people = rows;
                return res.render('employees', {data: people});                  
        }) 
                                                       
});                                                        
app.post('/add-employee-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values

    // Create the query and run it on the database
    queryEmployees = `INSERT INTO Employees ( firstName, lastName, job) VALUES ( '${data['fname']}', '${data['lname']}', '${data["jobtype"]}')`;
    db.pool.query(queryEmployees, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Employees');
        }
    })
})


 
/*
    MENUS
*/
app.get('/menuitems', function(req, res)
    {  
        let queryMenus = "SELECT * FROM Menus;";              

        db.pool.query(queryMenus, function(error, rows, fields){    

            res.render('menuitems', {data: rows});                  
        })                                                     
    });                                                       
   

    app.post('/add_menu_item-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Menus (name, price, itemCategory) VALUES ( '${data['item-name']}', '${data['price']}', '${data["item-catagory"]}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.send(rows);
            }
                
        })
    });

/*
    Orders
*/
app.get('/orders', function(req, res)
    {  
        let queryOrders = "SELECT * FROM Orders;";              

        db.pool.query(queryOrders, function(error, rows, fields){    

            res.render('orders', {data: rows});                  
        })                                                     
    });  
/*
    Payments
*/
app.get('/payments', function(req, res)
    {  
        let queryPayments = "SELECT * FROM Payments;";              

        db.pool.query(queryPayments, function(error, rows, fields){    

            res.render('payments', {data: rows});                  
        })                                                     
    });                                                                                                
/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on ' + PORT + '; press Ctrl-C to terminate.')
});
/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
var router = express.Router();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
PORT = 4776;

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


/*
    Employees
*/ 
app.get('/Employees', function(req, res)
    {  
        let queryEmployees;

        if (req.query.lastName === undefined)
        {
            queryEmployees = "SELECT * FROM Employees;";      
        }

        else
        {
            queryEmployees= `SELECT * FROM Employees WHERE lastName LIKE "${req.query.lastName}%"`
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
app.post('/delete-employee-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    queryEmployees = `DELETE FROM Employees WHERE employeeID = ${data['empid']}; `,

    db.pool.query(queryEmployees, function(error, rows, fields){
        if (error) {

           
            console.log(error)
            res.sendStatus(400);
        }

        
        else
        {
            res.redirect('/Employees');
        }
    })
})

app.post('/update-employee-form', function(req, res) {
    let data = req.body;

    queryEmployees = `UPDATE Employees SET firstName = "${data['fname']}", lastName = "${data['lname']}", job = "${data['jobtype']}" WHERE  employeeID = "${data['empid']}"; `,

    db.pool.query(queryEmployees, function(error, rows, fields){
        if (error) {

           
            console.log(error)
            res.sendStatus(400);
        }

        
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
        let queryMenus; 
        
        if (req.query.name === undefined)
        {
            queryMenus = "SELECT * FROM Menus;";      
        }
        else
        {
            queryMenus= `SELECT * FROM Menus WHERE name LIKE "${req.query.name}%"`
        }

        db.pool.query(queryMenus, function(error, rows, fields){    
            let people = rows;
            return res.render('menuitems', {data: people});                  
        })                                                     
    });                                                       
    

    app.post('/add-menuitem-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
    
        // Create the query and run it on the database
        queryMenus = `INSERT INTO Menus ( name, price, itemCategory) VALUES ( '${data['menuItemName']}', '${data['menuItemPrice']}', '${data["menuItemcategory"]}')`;
        db.pool.query(queryMenus, function(error, rows, fields){
    
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
                res.redirect('/menuitems');
            }
        })
    })

    app.post("/delete-menu-form", function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        queryMenuItems = `DELETE FROM Menus WHERE menuID = ${data['menuID']}; `;
       
        db.pool.query(queryMenuItems, function(error, rows, fields){
            if (error) {
    
               
                console.log(error)
                res.sendStatus(400);
            }
    
            
            else
            {
                res.redirect('/menuitems');
            }
        })
    })
                        
    app.post('/update-menus-form', function(req, res) {
        let data = req.body;
    
        queryMenus = `UPDATE Menus SET name = "${data['menuItemName']}", price = "${data['menuItemPrice']}", itemCategory = "${data['menuItemcategory']}"  WHERE  menuID = "${data['menuID']}"; `,
    
        db.pool.query(queryMenus, function(error, rows, fields){
            if (error) {
    
               
                console.log(error)
                res.sendStatus(400);
            }
    
            
            else
            {
                res.redirect('/menuitems');
            }
        })
    })
/*
    Orders
*/
app.get('/orders', function(req, res)
    {  
        let queryOrders;  
        
        if (req.query.orderType === undefined)
        {
            queryOrders = "SELECT * FROM Orders;";      
        }
        else
        {
            queryOrders= `SELECT * FROM Orders WHERE orderType LIKE "${req.query.orderType}%"`
        }

        db.pool.query(queryOrders, function(error, rows, fields){  
            let people = rows;
            return res.render('orders', {data: people});                  
        })                                                     
    });  



    app.post('/add-order-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
    
        // Create the query and run it on the database
        queryOrders = `INSERT INTO Orders ( employeeID, date, price, orderType ) VALUES ( '${data['empid']}', '${data['orderDate']}', '${data["orderPrice"]}', '${data["orderType"]}')`;
        db.pool.query(queryOrders, function(error, rows, fields){
    
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
                res.redirect('/Orders');
            }
        })
    })
    app.post("/delete-order-form", function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        
        queryorderItems = `DELETE FROM Orders WHERE orderID = ${data['orderID']}; `;

        db.pool.query(queryorderItems, function(error, rows, fields){
       
                if (error) {
    
               
                    console.log(error)
                    res.sendStatus(400);
                }
    
            
                else
                {
                    res.redirect('/orders');
                }
        })
    })   
                                                     
    app.post('/update-orders-form', function(req, res) {
        let data = req.body;
    
        queryOrders = `UPDATE Orders SET employeeID = "${data['empid']}", date = "${data['orderDate']}", price = "${data['orderPrice']}" , orderType = "${data['orderType']}" WHERE  orderID = "${data['orderID']}"; `,
    
        db.pool.query(queryOrders, function(error, rows, fields){
            if (error) {
    
               
                console.log(error)
                res.sendStatus(400);
            }
    
            
            else
            {
                res.redirect('/Orders');
            }
        })
    })
    
/*
    Payments
*/
app.get('/payments', function(req, res)
    {  
        let queryPayments  
        
        if (req.query.paymentType === undefined)
        {
            queryPayments = "SELECT * FROM Payments;";      
        }
        else
        {
            queryPayments= `SELECT * FROM Payments WHERE paymentType LIKE "${req.query.paymentType}%"`
        }

        db.pool.query(queryPayments, function(error, rows, fields){ 
            let people = rows;
            res.render('payments', {data: people});                  
        })                                                     
    });

   

    app.post('/add-payment-form', function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
    
        // Create the query and run it on the database
        queryPayments = `INSERT INTO Payments ( orderID, employeeID, date, orderType, paymentType, amount) VALUES ( '${data['orderID']}', '${data['staffOrderId']}', '${data['orderDate']}', '${data['paymentOrderTypee']}','${data["paymentType"]}', '${data["paymentAmount"]}')`;
        db.pool.query(queryPayments, function(error, rows, fields){
    
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
                res.redirect('/Payments');
            }
        })
    })

    app.post("/delete-payment-form", function(req, res){
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        queryPayments = `DELETE FROM Payments WHERE paymentID = ${data['paymentID']}; `;
       
        db.pool.query(queryPayments, function(error, rows, fields){
            if (error) {
    
               
                console.log(error)
                res.sendStatus(400);
            }
    
            
            else
            {
                res.redirect('/Payments');
            }
        })
    })
       
    app.post('/update-payment-form', function(req, res) {
        let data = req.body;
    
        queryPayments = `UPDATE Payments SET orderID = "${data['orderID']}", employeeID = "${data['staffOrderId']}", date = "${data['orderDate']}" , orderType = "${data['paymentOrderType']}" , paymentType = "${data['paymentType']}" , amount = "${data['paymentAmount']}"  WHERE  paymentID = "${data['paymentID']}"; `,
    
        db.pool.query(queryPayments, function(error, rows, fields){
            if (error) {
    
               
                console.log(error)
                res.sendStatus(400);
            }
    
            
            else
            {
                res.redirect('/Payments');
            }
        })
    })                  


/*
    OrderMenu
*/
app.get('/ordermenu', function(req, res)
    {  
        let queryOrdermenu  
        
        if (req.query.orderID === undefined)
        {
            queryOrdermenu = "SELECT * FROM orderMenus;";      
        }
        else
        {
            queryOrdermenu= `SELECT * FROM orderMenus WHERE orderID = "${req.query.orderID}%"`
        }

        db.pool.query(queryOrdermenu, function(error, rows, fields){ 
            let people = rows;
            res.render('ordermenu', {data: people});                  
        })                                                     
    });




/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on ' + PORT + '; press Ctrl-C to terminate.')
});


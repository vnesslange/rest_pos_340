module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getMenuItems(res, db, context, complete){
        db.pool.query( "SELECT * FROM Menus;", function(error, rows, fields){    
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = rows;
            complete();
        });

    }
        return router;
    }();
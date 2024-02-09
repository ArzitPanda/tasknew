const express =require('express');
const mongoose = require('mongoose')
const User = require('./Models/user.js')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDef = require("./swaggerDefination.js")
const TaskRouter = require("./Router/TaskRouter.js")
const Dbconnection = require("./DbConnection/index.js")
const UserRouter = require("./Router/UserRouter.js")
const TeamRouter = require("./Router/TeamRouter.js")
const cors = require('cors')
const specs = swaggerJsdoc(swaggerDef.swaggerOptions);



const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Serve Swagger UI


// Use your route

Dbconnection.DbConnection()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get("/",(req,res)=>{



    User.find().then(response=>res.send(response)).catch(err=>{console.log(err)})

    


})


app.use("/task",TaskRouter)
app.use("/user",UserRouter)
app.use("/team",TeamRouter)


app.listen(3001,()=>{console.log(3001)})
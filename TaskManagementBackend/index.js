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
const {QueryRouter} = require('./Router/QueryRoute.js');
const zoomRouter = require("./Router/ZoomRouter.js")
const cors = require('cors')
const specs = swaggerJsdoc(swaggerDef.swaggerOptions);
const http = require('http');
const socketIo = require('socket.io');



const app = express();

const server = http.createServer(app);
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const io = socketIo(server,{
    
    cors: {
        origin: "*", // Allow requests only from this domain
        methods: ["GET", "POST"] // Allow only these methods
      }}
    );


// Serve Swagger UI


// Use your route

Dbconnection.DbConnection()


app.get("/",(req,res)=>{



    User.find().then(response=>res.send(response)).catch(err=>{console.log(err)})

    


})




io.on('connection', (socket) => {
    console.log('A client connected');

    // Example: Send notification to client
    socket.on('joinRoom', (userId) => {
        // Emit Socket.IO event to notify cl
        socket.join(userId);
        console.log(`user join room ${userId}`)
    });
});


app.use("/task",TaskRouter(io))
app.use("/user",UserRouter)
app.use("/team",TeamRouter(io))
app.use("/task",QueryRouter)
app.use("/zoom",zoomRouter)

app.post('/api/save-push-subscription', (req, res) => {
    const subscription = req.body.subscription;
    // Assuming you have the user model
    User.findByIdAndUpdate(req.body.id, { pushSubscription: subscription })
        .then(() => {
            console.log('Push subscription saved for user:', req.body.id);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error('Error saving push subscription:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
server.listen(3001,()=>{console.log(3001)})


const mongoose = require('mongoose')


const DbConnection =() =>{

    const connect =  mongoose.connect("mongodb+srv://taskmanage:Panda2001@cluster0.4hcwv.mongodb.net/taskDb?retryWrites=true&w=majority")
.then(()=>{console.log("connect sucessfully")})
.catch(err=>console.log(err))
}


module.exports ={ DbConnection};
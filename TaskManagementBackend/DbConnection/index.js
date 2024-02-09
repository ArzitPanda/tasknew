const mongoose = require('mongoose')


const DbConnection =() =>{

    const connect =  mongoose.connect("mongodb+srv://arzit:Panda2001@cluster0.ngraetz.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{console.log("connect sucessfully")})
.catch(err=>console.log(err))
}


module.exports ={ DbConnection};
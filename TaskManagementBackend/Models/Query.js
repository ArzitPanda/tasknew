const mongoose = require('mongoose');




const query = mongoose.Schema({

    request:{
        type:String,
        required:true,
    }
    ,
    answer:
        [{type:String}],
        
    

},{timestamps:true})




module.exports = query
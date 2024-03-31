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


const model = mongoose.model('Query',query)

module.exports = {model,query}
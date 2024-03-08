const mongoose = require('mongoose');

const DesignationSchema = mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        team:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Team'
        },
        designation:{
                type:String,
                required:true

        },
       


}, { timestamps: true })

const Designation = mongoose.model('Designation', DesignationSchema);

module.exports = Designation;

    const mongose =require('mongoose')




    const userSchema = mongose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{

            type:String,
            required:true,
            unique:true
        },
        password:{

                type:String,
                required: true

        },
    
        DateOfBirth:{
                type:Date

        },
        Teams:[{
            type:mongose.Schema.Types.ObjectId,
            ref:'Team',
        }],
        ActiveTeam:{
            type:mongose.Schema.Types.ObjectId,
            ref:'Team',
        },
        Tasks:[{
            type:mongose.Schema.Types.ObjectId,
            ref:'Task',
        }],

        pushSubscription: {
            type: Object ,
            
        }

        



    })
   

const User  = mongose.model("User",userSchema);
module.exports = User;
import mongoose from 'mongoose';
const menssagesCollection  = 'messages';
const menssagesSchema = new mongoose.Schema({
    user:{
        type: String,
        max:50,
        required:true
    },
    message:{
        type: String,
        max:50,
        required:true
    }
})

export const messagesModel = mongoose.model(menssagesCollections, menssagesSchemaSchema)
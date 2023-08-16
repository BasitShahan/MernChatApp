const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://AbdulBasit:sofiabasit786@cluster0.hjnrvub.mongodb.net/MernChatApp').then
(()=>{
    console.log('connection success full')
})
.catch(()=>{
    console.log('connection failed')
})
const express=require('express')
const {Server} = require("socket.io")
const http = require('http');
const getUserDetailFromToken = require('../helpers/getUserDetailFromToken');
const UserModel = require('../model/UserModel');
const { conversationModel, messageModel } = require('../model/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app=express();

// socket connection
const server=http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

// socket running at http://localhost:8080/

// online user
const onlineUser = new Set()

io.on('connection',async (socket)=>{
    // console.log("connect User",socket.id)

    const token=socket.handshake.auth.token

    // current user detail
    const user = await getUserDetailFromToken(token)
    // console.log(user)

    // create a room
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser',Array.from(onlineUser))

    // socket.on('check-user',async (userId)=>{
    //     // console.log(userId,"bla");
    //     // console.log(userId.length);
    //     if(userId.length!=24){
    //         socket.emit('check-reply',{ans: false})
    //     }
    //     else{
    //         const userde=await UserModel.findById(userId);
    //         if(userde){
    //             socket.emit('check-reply',{ans: true});
    //         }
    //         else{
    //             socket.emit('check-reply',{ans:false});
    //         }
    //     }
    // })

    socket.on('message-page',async (userId)=>{
        // console.log('userId',userId);
        const userDetails = await UserModel.findById(userId).select("-password");
        if(!userDetails){
            socket.emit('check-user',{ans:false})
        }
        else{
            socket.emit('check-user',{ans:true});
            const payload={
                _id: userDetails?._id,
                name: userDetails?.name,
                email: userDetails?.email,
                profile_pic: userDetails?.profile_pic,
                online : onlineUser.has(userId)
            }

            socket.emit('message-user',payload)

            // get previous message
            const getConversationMessage = await conversationModel.findOne({
                "$or":[
                    { sender: user?._id, reciever: userId},
                    { sender: userId, reciever:user?._id}
                ]
            }).populate('messages').sort({updatedAt : -1})
            socket.emit('message',getConversationMessage || {sender: user?._id, reciever: userId,messages: []})
        }
    })


    // new message
    socket.on('new message',async (data)=>{

        // check conversation is available both user

        let conversation = await conversationModel.findOne({
            "$or":[
                { sender: data?.sender, reciever: data?.reciever},
                { sender: data?.reciever, reciever: data?.sender}
            ]
        })

        // if conversation is not available
        if(!conversation){
            const createConversation = await conversationModel({
                sender: data?.sender,
                reciever: data?.reciever
            })
            conversation = await createConversation.save()
        }

        const message=await messageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId : data?.sender,
        })

        const saveMessage=await message.save();

        const updateConversation = await conversationModel.updateOne({_id: conversation?._id},{
            "$push": {messages: saveMessage?._id}
        })

        const getConversationMessage = await conversationModel.findOne({
            "$or":[
                { sender: data?.sender, reciever: data?.reciever},
                { sender: data?.reciever, reciever: data?.sender}
            ]
        }).populate('messages').sort({updatedAt : -1})

        // io.to(data?.sender).emit('message',getConversationMessage?.messages || [])
        // io.to(data?.reciever).emit('message',getConversationMessage?.messages || [])
        io.to(data?.sender).emit('message',getConversationMessage || {})
        io.to(data?.reciever).emit('message',getConversationMessage || {})

        // send conversation
        const conversationSender =await getConversation(data?.sender)
        const conversationReciever =await getConversation(data?.reciever)

        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.reciever).emit('conversation',conversationReciever)

    })

    // sidebar
    socket.on('sidebar',async (currentUserId)=>{
        // console.log("current user",currentUserId);

        const conversation =await getConversation(currentUserId)

        socket.emit('conversation',conversation)
    })

    socket.on("seen",async (msgbyUserId)=>{

        let conversation = await conversationModel.findOne({
            "$or":[
                { sender: user?._id, reciever: msgbyUserId},
                { sender: msgbyUserId, reciever: user?._id}
            ]
        })

        const conversationMessagesId = conversation?.messages || []

        const updateMessages = await messageModel.updateMany(
            { _id : { "$in" : conversationMessagesId}, msgByUserId: msgbyUserId},
            {"$set" : {seen : true}}
        )

        // send conversation
        const conversationSender =await getConversation(user?._id?.toString())
        const conversationReciever =await getConversation(msgbyUserId)

        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgbyUserId).emit('conversation',conversationReciever)
    })

    // disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id?.toString())
        io.emit('onlineUser',Array.from(onlineUser))
        // console.log('disconnect user' , socket.id)
    })
})

module.exports={
    app,
    server
}
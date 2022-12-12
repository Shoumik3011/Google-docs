const mongoose = require("mongoose")
const Document = require("./Document")

//mongoose.connect("mongodb://localhost/cloud-project", {});

mongoose.connect("mongodb://0.0.0.0:27017/", {
});

const io=require("socket.io")(3001,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    },
})

const defaultVal = ""

io.on("connection",socket => {
    socket.on('get-document',async documentID => {
        const document = await findorCreateDoc(documentID)
        socket.join(documentID)
        socket.emit("load-document",document.data)
        socket.on("send-changes",delta => {
            socket.broadcast.to(documentID).emit("receive-changes",delta)
            //console.log(delta)
        })
        socket.on("save-document",async data => {

            await Document.findByIdAndUpdate(documentID,{ data })
        })
    })
    })
    
async function findorCreateDoc(id)
{
    if(id==null) return 
    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id: id, data: defaultVal})
}

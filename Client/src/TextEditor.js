import React, { useCallback, useEffect,useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
const SAVE_INTERVAL_MILLISEC = 2000
const TOOLBAR_OPTIONS=[
    [{header: [1,2,3,4,5,6,false]}],
    [{font: []}],
    [{list: "ordered"},{list:"bullet"}],
    ["bold","italic","underline"],
    [{color: []},{background: []}],
    [{script: "sub"},{script: "super"}],
    [{align: []}],
    ["image","blockquote","code-block"],
    ["clean"],
]


export default function TextEditor() {
    const { id: documentId } = useParams()
    const [socket,setSocket] = useState()
    const [quill,setQuill] = useState()
    console.log(documentId)

    useEffect(() => {
       const s= io("http://localhost:3001")
       setSocket(s);

       return () => {
        s.disconnect()
       }
    },[])

    useEffect(() => {
        if (socket == null || quill == null) return
        socket.once("load-document", document => {
          quill.setContents(document)
          quill.enable()
        })
    
        socket.emit("get-document", documentId)
    }, [socket, quill, documentId])

    useEffect(() => {
        if (socket == null || quill == null) return
        // save the document after every time interval that is defined above in SAVE_INTERVAL_MILLISEC (2 sec or 2000 milli sec)..
        const interval = setInterval(() => {
            socket.emit("save-document",quill.getContents())  // get document contents to store in the database
        },SAVE_INTERVAL_MILLISEC)
        return () => {
            clearInterval(interval) //clearing the interval..
        }
    },[socket,quill])

    useEffect(() => {
        if (socket ==null || quill == null) return
        const handler =delta => {
            quill.updateContents(delta)
        }
         socket.on('receive-changes',handler)
         return () => {
            socket.off('receive-changes',handler)
         }
    },[socket,quill])

    useEffect(() => {
        if (socket ==null || quill == null) return
        const handler =(delta,oldDelta,source) => {
            if(source !== 'user') return
            socket.emit("send-changes",delta)
        }
         quill.on('text-change',handler)
         return () => {
            quill.off('text-change',handler)
         }
    },[socket,quill])

    function loadHistoryStack(stack,editor) {
        var Delta = Quill.import('delta');
        if (stack.undo.length > 0) {
          for (var i = 0; i < stack.undo.length; i++) {
              var ob = {};
              ob.redo = new Delta(stack.undo[i].redo.ops);
              ob.undo = new Delta(stack.undo[i].undo.ops);
              editor.history.stack.undo.push(ob)
          }
        }
        if (stack.redo.length > 0) {
          for (var i = 0; i < stack.redo.length; i++) {
              var ob = {};
              ob.redo = new Delta(stack.redo[i].redo.ops);
              ob.undo = new Delta(stack.redo[i].undo.ops);
              editor.history.stack.redo.push(ob)
          }
        }
      }  

    
    const wrapperRef = useCallback((wrapper) => { 
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor) 
        // quill with history stack module for handling undo and redo in quill...
        const q=new Quill(editor, {history: {
            delay: 0,
            maxStack: 500,
            userOnly: true
          },theme: "snow",modules:{toolbar: TOOLBAR_OPTIONS} })
        //quill spelling check..
        q.root.setAttribute('spellcheck',"true")
        q.disable()
        q.setText('Loading the document...')
        setQuill(q)  
        //q.history.clear();        // creating the history stack..

    },[]) 
    return <div className="container" ref={wrapperRef}></div>
}
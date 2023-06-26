import NoteContext from './noteContext';
import { useState } from "react";


const NoteState = (props)=>{
    let host = "http://localhost:5000";

    let initialNotes = []
    const [notes, setNotes] = useState(initialNotes)

    // Get all notes
    const getAllNotes = async ()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
        });
        const notes = await response.json();
        setNotes(notes);
    }

    
    // Add a Note
    const addNote = async (title,description,tag)=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
        });

        const note = await response.json();
        setNotes(notes.concat(note));
    }
    // Delete a Note
    const deleteNote = async (id)=>{
        // API CALL
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            
        });

        const json = await response.json(); // parses JSON response into native JavaScript objects

        const newNotes = notes.filter((note)=>{
            return note._id !== id;
        })
        setNotes(newNotes);
    }
    // Edit a Note
    const editNote = async (id,title,description,tag)=>{ 
        // API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag}), // body data type must match "Content-Type" header
        });
         const json = await response.json(); // parses JSON response into native JavaScript objects

        let newNotes = JSON.parse(JSON.stringify(notes));
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = notes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    } 
   
    return(
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
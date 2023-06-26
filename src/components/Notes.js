import React, { useContext , useState , useEffect, useRef } from 'react'
import noteContext from '../context/notes/noteContext'
import Noteitem from './Noteitem';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getAllNotes, editNote} = context;
    const navigate = useNavigate();

    useEffect(() => {
        console.log(localStorage.getItem('token'),"too");
        if(localStorage.getItem('token')){
            getAllNotes();
        }
        else{
            navigate('/login');
        // eslint-disable-next-line 
        }
    }, [])

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({id:"",etitle:"",edescription:"",etag:"default"});

    const updateNote = (currNote) => {
        ref.current.click();
        setNote({id:currNote._id, etitle:currNote.title , edescription:currNote.description , etag:currNote.tag});
    }

    const handleClick = (e)=>{
        editNote(note.id,note.etitle,note.edescription,note.etag);
        refClose.current.click();
        props.showAlert("Saved Successfully.", "success");
    }
    
    const onChange = (e)=>{
        setNote({...note,[e.target.name]: e.target.value});
    }

return (
<> 

    <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    
                </div>

                <form className='my-3 container'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label" >Title</label>
                        <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label" >Description</label>
                        <input type="text" className="form-control" value={note.edescription} onChange={onChange} id="edescription" name="edescription" minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" value={note.etag} onChange={onChange} id="etag" name="etag" />
                    </div>
                </form> 

                <div className="modal-footer">
                    <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" onClick={handleClick} className="btn btn-primary" >Save changes</button>
                </div> 
            </div>
        </div>
    </div>

    <div className="row my-3">
        
        {notes.length ===0 && <div className="container mx-2"> 
            No notes to display.
            </div> 
        }

        {notes.length > 0 && notes.map((note) => {
            return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
            }) 
        }

    </div>

</>
)
}

export default Notes

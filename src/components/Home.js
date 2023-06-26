import React from 'react'
import Notes from './Notes'
import AddNote from './AddNote'

export default function Home(props) {
    const {showAlert} = props;
    return (
        <div>
            <AddNote showAlert={showAlert}/>
            <Notes showAlert={showAlert}/>
        </div>
    )
}

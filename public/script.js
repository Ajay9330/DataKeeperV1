async function fetchLinks() {
    const response = await fetch('/getLinks');
    const links = await response.json();
    const linksList = document.getElementById('links-list');
    linksList.innerHTML = '';
    links.forEach(link => {
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('link-item');
    
        const linkText = document.createElement('a');
        linkText.innerText = link;
        linkText.href=link;
        linkText.target='_blank'
        linkContainer.appendChild(linkText);
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleteLink(link));
        linkContainer.appendChild(deleteButton);
    
        linksList.appendChild(linkContainer);
    });
    
}

async function addLink() {
    const linkInput = document.getElementById('link-input');
    const link = linkInput.value.trim();

    if (link !== '') {
        await fetch(`/addLink/${encodeURIComponent(link)}`, { method: 'POST' });
        linkInput.value = '';
        fetchLinks();
    }
}

async function deleteLink(link) {
    await fetch(`/deleteLink/${encodeURIComponent(link)}`, { method: 'DELETE' });
    fetchLinks();
}


//notes
async function fetchNotes() {
    try {
        const response = await fetch('/getNotes');
        const notes = await response.json();
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';

        notes.forEach(note => {
            const li = document.createElement('div');
            const litext = document.createElement('span');
            litext.innerText = note;
            li.appendChild(litext);
            li.classList.add('note-item'); // Apply the CSS class to the note item

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => deleteNoteHandler(note));

            li.appendChild(deleteButton);
            notesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function addNote() {
    try {
        const noteInput = document.getElementById('note-input');
        const note = noteInput.value;

        const response = await fetch(`/addNote/${note}`, { method: 'POST' });
        const message = await response.text();

        fetchNotes();  // Fetch notes again after adding a note
        noteInput.value = '';
    } catch (error) {
        console.error('Error adding note:', error);
    }
}

async function deleteNoteHandler(note) {
    try {
        const response = await fetch(`/deleteNote/${note}`, { method: 'DELETE' });
        const message = await response.text();

        fetchNotes();  // Fetch notes again after deleting a note
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

function clearCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
function logout(){
    clearCookie('id');
    clearCookie('pass');
    window.location.reload();
}
 


// Fetch notes on page load
fetchNotes();

document.addEventListener('DOMContentLoaded', fetchLinks);

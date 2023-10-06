const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser());



async function del(filePath,linkToDelete,res){
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error deleting link.');
        } else {
            const updatedLinks = data.split('\n').filter(link => link.trim() !== linkToDelete);
            const updatedLinksText = updatedLinks.join('\n');
            
            fs.writeFile(filePath, updatedLinksText, (err) => {
                if (err) {
                    res.status(500).send('Error deleting link.');
                } else {
                    res.send('Link deleted successfully.');
                }
            });
        }
    });
}

async function getd(filePath,res){
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading user links.');
        } else {
            const links = data.split('\n').filter(link => link.trim() !== '');
            res.json(links);
        }
    });

}
async function add(filePath, link, res) {
    fs.appendFile(filePath, `${link}\n`, 'utf8', (err) => {
        if (err) {
            res.status(500).send('Error adding link.');
        } else {
            res.send('Link added successfully.');
        }
    });
}


const usersFilePath = path.join(__dirname, 'users.txt');

function userExist(email, password) {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');

        const users = data.split('\n');
        for (const user of users) {
            const [storedEmail, storedPassword] = user.split(':');
            if (storedEmail === email && storedPassword === password) {
                console.log('User exists:', storedEmail);
                return true;
            }
        }
    } catch (error) {
        console.error('Error reading users file:', error);
    }
    return false;
}
app.use(express.json());
app.use(express.static('public'));


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Perform validation or check credentials here (replace with your own logic)
    const success = userExist(username,password);

    res.json({ success });
});
app.get('/login', (req, res) => {
    const emailFromCookie = req.cookies.id;
    const passwordFromCookie = req.cookies.pass;

    if (emailFromCookie && passwordFromCookie && userExist(emailFromCookie, passwordFromCookie)) {
        res.redirect('/');
    } else {
        console.log('Redirecting to login page');
        res.sendFile(path.join(__dirname, 'pages', 'login.html'));
    }
});
app.use((req, res, next) => {
    const emailFromCookie = req.cookies.id;
    const passwordFromCookie = req.cookies.pass;
  
    if (emailFromCookie && passwordFromCookie && userExist(emailFromCookie, passwordFromCookie)) {
        next();
    } else {
        res.redirect('/login');
        console.log("hi");
    }

});


app.get('/adduser.html',(req,res)=>{
    
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});
app.get('/mynotes', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'mynotes.html'));
});
app.get('/mylinks', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'mylinks.html'));
});

app.get('/getLinks', (req, res) => {
   const p=path.join(__dirname, 'public', 'data', 'userlinks.txt');
   getd(p,res);
});

app.post('/addLink/:link', (req, res) => {
    const link = req.params.link;
    const filePath = path.join(__dirname, 'public', 'data', 'userlinks.txt');
    add(filePath, link, res);
});

app.delete('/deleteLink/:link', (req, res) => {
    const link = req.params.link;
    const filePath = path.join(__dirname, 'public', 'data', 'userlinks.txt');
    del(filePath,link,res);
    
});


// Add note route
app.post('/addNote/:note', (req, res) => {
    const note = req.params.note;
    const filePath = path.join(__dirname, 'public', 'data', 'usernotes.txt');
    add(filePath, note, res);
});

// Delete note route
app.delete('/deleteNote/:note', (req, res) => {
    const note = req.params.note;
    const filePath = path.join(__dirname, 'public', 'data', 'usernotes.txt');
    del(filePath, note, res);
});
//
app.get('/getNotes', (req, res) => {
    const note = req.params.note;
    const filePath = path.join(__dirname, 'public', 'data', 'usernotes.txt');
    console.log("getting");
    getd(filePath, res);

});
app.use((req,res)=>{
    res.status(404).send("page not found");
})

app.listen(process.env.port || 3000, () => {
    console.log('App running on port 3000');
});

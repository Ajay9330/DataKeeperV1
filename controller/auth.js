
const fs = require('fs');

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
module.exports = {
    del,
    getd,
    add
};
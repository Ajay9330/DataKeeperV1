const fs = require('fs').promises;
const path = require('path');

const linksFilePath = path.join(__dirname, 'public', 'data', 'userlinks.txt');

const getUserLinks = async () => {
    try {
        const data = await fs.readFile(linksFilePath, 'utf8');
        if (!data) return [];
        
        const links = data.split('\n').map(link => link.trim()).filter(link => link !== '');
        return links;
    } catch (error) {
        throw new Error('Error reading user links.');
    }
};

const addUserLink = async (link) => {
    try {
        await fs.appendFile(linksFilePath, `${link}\n`, 'utf8');
        return 'Link added successfully.';
    } catch (error) {
        throw new Error('Error adding link.');
    }
};

const deleteUserLink = async (linkToDelete) => {
    try {
        const data = await fs.readFile(linksFilePath, 'utf8');
        const updatedLinks = data.split('\n').map(link => link.trim()).filter(link => link !== linkToDelete);
        const updatedLinksText = updatedLinks.join('\n');
        await fs.writeFile(linksFilePath, updatedLinksText);
        return 'Link deleted successfully.';
    } catch (error) {
        throw new Error('Error deleting link.');
    }
};

module.exports = {
    getUserLinks,
    addUserLink,
    deleteUserLink
};

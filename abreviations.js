import fs from 'fs';

const getConsoleNames = () => {
    const file = fs.readFileSync('abreviation.json');

    if (!file.toString()) throw new Error('games.json not found, try running "node get-games-list-from-retroarch.js" before')

    const games = JSON.parse(file.toString());

    return games;
}

const consoles = getConsoleNames().reduce((prev, curr) => {
    const key = Object.keys(curr)[0];
    return {
        ...prev,
        [key]: curr[key]
    }
}, {})

fs.writeFileSync('abreviation.json', JSON.stringify(consoles, null, 4));
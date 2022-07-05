import * as fs from 'fs';
import * as stringSimilarity from 'string-similarity';
import readLine from 'readline-sync';

const readGamesJson = () => {
    const file = fs.readFileSync('games.json');

    return JSON.parse(file.toString());
}

const findClosestMatch = (rom, consoleGameList, romFolder, porcentage) => {
    const romNameWithoutExtension = removeExtension(rom);
    const similarity = stringSimilarity.findBestMatch(romNameWithoutExtension, consoleGameList);
    const closest = similarity.bestMatch.target;
    const distance = similarity.bestMatch.rating;
    
    if(romNameWithoutExtension !== closest) {
        console.log('old:',romNameWithoutExtension, "new:", closest, "porcentage:", distance)
    }
}

const removeExtension = (name = '') => {
    const splitted = name.split('.');
    splitted.pop();
    return splitted.join('.');
}

const games = readGamesJson();

let folder = readLine.question('Digit the path to roms folder: ');

let consoleFolders;
try {
    if (folder[folder.length - 1] === '/') {
        folder = folder.substring(0, folder.length - 1);
    }

    consoleFolders = fs.readdirSync(folder);
} catch (e) {
    throw new Error('Invalid path folder');
}

consoleFolders.forEach(consoleName => {
    const consoleGameList = games[consoleName];
    const romFolder = folder+'/'+consoleName+'/';
    const romNames = fs.readdirSync(romFolder)

    romNames.forEach(rom => findClosestMatch(rom, consoleGameList, romFolder))
})

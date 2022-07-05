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

    //best porcentage so far: 0.394

    if(distance >= porcentage && romNameWithoutExtension !== closest) {
        changeFileName(rom, closest, romFolder)
    }
}

const changeFileName = (rom, closest, romFolder) => {
    const romExtension = rom.split('.').pop();
    const newFileName = closest+'.'+romExtension;

    console.log(`from: ${romFolder}${rom}, to: ${romFolder}${newFileName}`)

    fs.rename(romFolder+rom, romFolder+newFileName, (err) => {
        if(err) throw err;

        const log = {
            from: romFolder+rom,
            to: romFolder+newFileName
        }

        try {
            const file = fs.readFileSync('log.json')

            const logs = JSON.parse(file.toString());
            logs.push(log)

            fs.writeFileSync('log.json', JSON.stringify(logs, null, 4))
        } catch(e) {
            const logs = [log];

            fs.writeFileSync('log.json', JSON.stringify(logs, null, 4))
        }

        console.log(log)
    })
}

const removeExtension = (name = '') => {
    const splitted = name.split('.');
    splitted.pop();
    return splitted.join('.');
}

const games = readGamesJson();

let folder = readLine.question('Digit the path to roms folder: ');
const porcentage = readLine.question('Percentage of similarity: The minimun percentage of similarity to change the name. Too little, the chances of changing to a wrong name will be higher. Too much, the chance of not changing to a correct name will be higher. Recomended: 0.394. Between 0 and 1:');
const nPor = Number(porcentage);

if(nPor === NaN || nPor <= 0 || nPor > 1) {
    throw new Error('Invaid porcentage');
}

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

    romNames.forEach(rom => findClosestMatch(rom, consoleGameList, romFolder, nPor))
})

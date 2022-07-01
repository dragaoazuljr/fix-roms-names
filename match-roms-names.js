import * as fs from 'fs';
import * as closestMatch from 'closest-match';
import * as stringSimilarity from 'string-similarity';

const readGamesJson = () => {
    const file = fs.readFileSync('games.json');

    return JSON.parse(file.toString());
}

const findClosestMatch = (rom, consoleGameList, romFolder) => {
    const romNameWithoutExtension = removeExtension(rom);
    const similarity = stringSimilarity.findBestMatch(romNameWithoutExtension, consoleGameList);
    const closest = similarity.bestMatch.target;
    const distance = similarity.bestMatch.rating;

    //best porcentage so far: 0.394

    if(distance >= 0.394 && romNameWithoutExtension !== closest) {
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

const folder = '/media/danillo-moraes/Linux/roms';

const consoleFolders = fs.readdirSync(folder);

consoleFolders.forEach(consoleName => {
    const consoleGameList = games[consoleName];
    const romFolder = folder+'/'+consoleName+'/';
    const romNames = fs.readdirSync(romFolder)

    romNames.forEach(rom => findClosestMatch(rom, consoleGameList, romFolder))
})

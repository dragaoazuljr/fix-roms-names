import fs from 'fs'
import readLine from 'readline-sync';
import * as stringSimilarity from 'string-similarity';

const getConsoleNames = () => {
    const file = fs.readFileSync('games.json');

    if (!file.toString()) throw new Error('games.json not found, try running "node get-games-list-from-retroarch.js" before')

    const games = JSON.parse(file.toString());

    return Object.keys(games);
}

const getAbreviations = () => {
    const file = fs.readFileSync('abreviation.json');

    const abv = JSON.parse(file.toString());

    const abvValues = Object.keys(abv).reduce((prev,key) => {
        const value = abv[key];

        if (value.length > 0) {
            return {
                ...prev,
                ...value.reduce((prev, curr) => ({...prev, [curr]: key}), {})
            }
        } else {
            return prev
        }
    }, {})

    return abvValues
}

const folderDir = readLine.question('Digit the path to the folders: ');
const consoles = getConsoleNames();
const abreviations = getAbreviations();
const folders = fs.readdirSync(folderDir)

const foldersCorrected = folders.reduce((prev, curr) => {
    const isAbv = abreviations[curr];

    if (isAbv) {
        prev.push({
            from: curr,
            to: isAbv
        })

        return prev
    }

    const similarity = stringSimilarity.findBestMatch(curr, consoles);
    let closest = similarity.bestMatch.target;
    const prevConsoles = prev.map(p => p.to);

    if (prevConsoles.includes(closest)){
        closest = similarity
            .ratings
            .sort((a,b) => a.rating - b.rating)
            .find(sim => !prevConsoles.includes(sim.target))?.target
        
        if (!closest) closest = curr
    }
    
    if (curr !== closest) {
        prev.push({
            from: curr,
            to: closest
        })
    }

    return prev;
}, [])

const newFolders = foldersCorrected.map(fd => fd.to)
const foldersWithSameName = newFolders.some((el, index) => {
    return newFolders.indexOf(el) !== index
})

if (foldersWithSameName) {
    console.log("There are more then one folder that will change to one system, rename one of the folders to a diferent name or merge the contents of the two folders: ")
 
    const fd = foldersCorrected.map(f => f.to);
    
    foldersCorrected
    .filter((el, index) => fd.indexOf(el.to) !== index)
    .forEach(el => {
        const oldFolders = foldersCorrected.filter(f => f.to === el.to).map(f => f.from);

        console.log('New folder name:', el.to, 'Old folders:', oldFolders)
    })
} else {
    console.log(foldersCorrected);

    const change = readLine.question('Change the name of the folders? (y/n)')
    
    if (change === 'y') {
        const log = [];
        foldersCorrected.forEach(fd => {
            const old = folderDir[folderDir.length - 1] === '/' ? `${folderDir}${fd.from}` : `${folderDir}/${fd.from}`;
            const newf = folderDir[folderDir.length - 1] === '/' ? `${folderDir}${fd.to}` : `${folderDir}/${fd.to}`;
            fs.renameSync(old, newf);
            log.push({
                from: old,
                to: newf
            });
        })
    
        fs.writeFileSync('log-folder.json', JSON.stringify(log, null, 4))
    } else {
        console.log('Try changing the folder name to a more understable name, e.g "snes" change to: "super nintendo"')
    }
}


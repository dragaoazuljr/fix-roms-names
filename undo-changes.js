import fs from 'fs';
import readLine from 'readline-sync';

const readLog = (fileName) => {
    const file = fs.readFileSync(fileName);

    return JSON.parse(file.toString());
}

const fileName = readLine.question('What you want to undo? roms or folder change ? (r/f)')

if(fileName === 'r' || fileName === 'f') {
    const log = readLog(fileName === 'r' ? 'log.json' : 'log-folder.json');
    
    log.forEach(l => fs.renameSync(l.to, l.from));
}    

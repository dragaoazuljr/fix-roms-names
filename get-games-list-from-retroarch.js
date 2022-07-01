// const got = require('got');
// const { JSDOM } = require('jsdom');
import got from 'got';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';

const URL = 'https://thumbnails.libretro.com';

const isConsoleLink = (e) => {
    return e.textContent.includes('/') && e.href != undefined && e.href != '../';
}

const getMasterList = async () => {
    console.log('Starting');
    const res = await got(URL);
    const dom = new JSDOM(res.body);

    const nodeList = [...dom.window.document.querySelectorAll('a')];

    nodeList
        .filter(isConsoleLink)
        .map(e => ({
            console: e.textContent.replace('/', ''),
            link: `${URL}/${e.href}Named_Boxarts/`
        }))
        .forEach(async (game) => await getGamesNames(game))
    
    console.log(nodeList.length)
}

const getGamesNames = async (game) => {
    console.log('Getting games from: '+ decodeURIComponent(game.link));
    const res = await got(game.link).catch(e => ({body: ''}))
    const dom = new JSDOM(res?.body);

    const nodeList = [...dom.window.document.querySelectorAll('a')]

    const gameNames = nodeList
        .filter(n => n.href != undefined && n.href != '../')
        .map(e => {
            const gameNameLink = e.href;
            
            const decode = decodeURIComponent(gameNameLink);
            const filename = decode.split('/').pop().replace('.png', '');

            return filename;
        })

    const file = fs.readFileSync('games.json');
    const data = JSON.parse(file.toString());

    data[game.console] = gameNames;

    fs.writeFileSync('games.json', JSON.stringify(data, null, 4))
}

getMasterList();
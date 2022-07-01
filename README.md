# Fix roms names
A node application that find the best match for each rom name using retroarch db as source

## Instalation
`$ npm install`

## Runing
- First run `$ node get-games-list-from-retroarch.js` to create a games.json with all the games found on thumbnails.retroarch.com
- Then run `$ node match-roms-names.js` to find the best match and rename the rom files.
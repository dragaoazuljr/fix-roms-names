# Fix roms names
A node application that find the best match for each rom name using retroarch db as source

## Installation
Must have node installed on the machine. after installed, `cd` to repo folder and run:
`$ npm install`

## Running
First run `$ node get-games-list-from-retroarch.js` to create a `games.json` with all the games found on [thumbnails.libretro.com](https://thumbnails.libretro.com/)
Then you must change the console's folder's name to match the ones on retroarch database, to do this run `$ node match-folder-name.js` It will ask the path to the folder of the roms, then it will show what will change and ask if can change the name of the folders.
e.g:
```
node match-folder-name.js
Digit the path to the folders: /home/danillo-moraes/consoles
[
  { from: 'atari 7000', to: 'Atari - 7800' },
  { from: 'game boy', to: 'Nintendo - Game Boy' },
  { from: 'game boy color', to: 'Nintendo - Game Boy Color' },
  { from: 'gba', to: 'Nintendo - Game Boy Advance' },
  { from: 'nes', to: 'Nintendo - Nintendo Entertainment System' },
  { from: 'ninendo entretent system', to: 'Emerson - Arcadia 2001' },
  { from: 'nintendo 64', to: 'Nintendo - Nintendo 64' },
  { from: 'ps2', to: 'Sony - PlayStation 2' },
  { from: 'ps3', to: 'Sony - PlayStation 3' },
  { from: 'psp', to: 'Sony - PlayStation Portable' },
  { from: 'psx', to: 'Sony - PlayStation' },
  { from: 'sega cd', to: 'Sega - Mega-CD - Sega CD' },
  { from: 'sega dreamcast', to: 'Sega - Dreamcast' },
  {
    from: 'super nintendo',
    to: 'Nintendo - Super Nintendo Entertainment System'
  },
  { from: 'wii', to: 'Nintendo - Wii' }
]
Change the name of the folders? (y/n)y
``` 
If it can't find the correct console name, you can either change the folder manually to match or came closer to the ones on the database, or add the name/abbreviation to the `abreviations.json` file. Find the correct console and add the name to the array. **Important**: It should be a valid json file, if not the script will not work, try using some json-validator website to verify if the json is valid before changing.

Then run `$ node list-best-rom-name.js` to show a list with the best possible match, it will ask the rom folder (same one as before) and return a list with old name, new name and a **percentage**. This percentage show how much the new name match with the old one. Too little, the chances of changing to a wrong name will be higher. Too much, the chance of not changing to a correct name will be higher. From personal experience the best value has been 0.394, but yours could change. Try running the command and finding the lowest number who change the rom to the correct name. e.g:

```
 node list-best-rom-name.js
Digit the path to roms folder: /home/danillo-moraes/consoles
old: Super mario 64 new: Super Mario 64 (USA) porcentage: 0.6666666666666666
old: metal gear solid 4 guns of the patriots new: El Shaddai - Ascension of the Metatron (Japan) porcentage: 0.3188405797101449
```
Relax, it will not change the extension of the file (.iso, .zip, .n64...).

In the case above it correctly found the Super Mario 64 name, but didn't find the correct name for mgs4 ([thumbnails.libretro.com](https://thumbnails.libretro.com/) don't have this game cataloged, at least at the time I'm creating this script), so running the next command with a percentage of 0.6 is recommended.

Then run `$ node match-roms-names.js` to rename the rom files, it will ask the folder (same one as before) and the percentage.

After the change, the script will create two files, `log.json` and `log-folder.json`. In case you want to undo those changes, you can run `$ node undo-changes.js` and select what you want to undo (r = roms, f = folders), if you want to undo all changes, is best to select `r` first to undo the roms and run again and select `f` to undo the folders.

Have fun and enjoy those beautifuls artworks!

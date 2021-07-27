const { ipcRenderer } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

window.addEventListener('DOMContentLoaded', () => {

    // ADD A LOADING ICON
    let loaderContainer = document.createElement('div')
    loaderContainer.id = 'loaderContainer'
    loaderContainer.classList.add('loaderContainer')
    
    let loader = document.createElement('div')
    loader.id = 'loader'
    loader.classList.add('loader')

    loaderContainer.appendChild(loader)

    document.getElementById('screen').appendChild(loaderContainer)

    // RUN THE PYTHON VAL SCRIPT 
    var pythonPath = path.join(__dirname, 'valorantApi/getValShop.py')
    console.log(__dirname)
    exec(`python "${pythonPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // SET THE SHOP SKINS
        const skins = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/valShop.json')))
    
        var itemNames = document.getElementsByClassName('itemName')
        var itemImages = document.getElementsByClassName('itemImage')
    
        for (let i = 0; i < skins.length; i++) {
            const element = skins[i];
    
            itemNames[i].innerText = element.displayName        
            itemImages[i].src = element.displayIcon
        }

        // REMOVE LOADING ICON
        loaderContainer.remove()
    })
    
    // SET USERNAME
    const username = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/config.json')))['USERNAME']
    document.getElementById('username').innerText = username

    // SET BACKFGROUND IMAGE
    var screen = document.getElementById('screen')

    var backgroundPath = path.join(__dirname, 'assets/backgrounds')

    var images = fs.readdirSync(backgroundPath)
    var randomUrl = images[Math.floor(Math.random() * images.length)]

    var cssUrlBG = `url('${'assets/backgrounds/' + randomUrl}')`
    screen.style.backgroundImage = cssUrlBG

    // CLOSE BUTTON EVENTS
    var closeButton = document.getElementById('closeButton')

    closeButton.addEventListener('click', () => {
        ipcRenderer.send('closeApp')
    })

})
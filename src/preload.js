const electron = require('electron')
const {ipcRenderer} = electron

function loadStore(){
    ipcRenderer.send('store:req')
}
function setBackground(){
    ipcRenderer.send('bg:req')
}

ipcRenderer.on('bg:res', (e, url) => {
    var screen = document.getElementById('screen')

    var cssUrlBG = `url('${'assets/backgrounds/' + url}')`
    screen.style.backgroundImage = cssUrlBG
})

ipcRenderer.on('store:res', (e, skins, username) => {    
    // Set Shop skins
    var itemNames = document.getElementsByClassName('itemName')
    var itemImages = document.getElementsByClassName('itemImage')
    
    for(i = 0; i < skins.length; i++){
        itemNames[i].innerText = skins[i].displayName
        itemImages[i].src = skins[i].displayIcon
    }

    // Set Username
    document.getElementById('username').innerText = username
})

window.addEventListener('DOMContentLoaded', () => {
    loadStore()
    setBackground()

    document.getElementById('close').onclick = () => {
        ipcRenderer.send('win:close')
    }

    document.getElementById('minimize').onclick = () => {
        ipcRenderer.send('win:min')
    }
    
    document.getElementById('maximize').onclick = () => {
        ipcRenderer.send('win:max')
    }
})
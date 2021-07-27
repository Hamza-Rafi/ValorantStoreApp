const { app, BrowserWindow, ipcMain, Menu, Tray } = require("electron")
const path = require('path')

function createWindow(){
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
        nodeIntegration: true,
        frame: false,
        show: false
    })

    win.loadFile(path.join(__dirname, 'index.html'))
    
    win.once('ready-to-show', () => {
        win.show()
    })
}

let tray = null
let isAppHidden = false

app.whenReady().then(() => {
    createWindow()

    tray = new Tray(path.join(__dirname, 'assets/valIcon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Open App', click: function(){
            win.reload()
            win.show()
        }},
        {label: 'Quit', click: function(){
            app.quit()
        }}
    ])
    tray.setToolTip('Valorant Shop')
    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => {
        if(isAppHidden == true){
            win.reload()
            win.show()
        }
    })
})

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') app.quit()
// })

ipcMain.on('closeApp', (evt, arg) => {
    win.hide()
    isAppHidden = true
})

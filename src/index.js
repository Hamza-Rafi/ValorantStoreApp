const { app, BrowserWindow, ipcMain } = require("electron")
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')
const { time } = require("console")

let win

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
        icon: path.join(__dirname, 'assets/valIcon.ico')
    })

    win.loadFile(path.join(__dirname, 'index.html'))
    
}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('win:close', (evt, arg) => {
    app.quit()
})
ipcMain.on('win:min', (evt, arg) => {
    win.minimize()
})
ipcMain.on('win:max', (evt, arg) => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
})


function getStore(){
    var pythonPath = path.join(__dirname, 'valorantApi/getValShop.py')
    exec(`python "${pythonPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // Set timestamp in file
        fileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/valShop.json')))

        var timeNow = new Date(Date.now()) 
        var nextDay = new Date()
        nextDay.setDate(timeNow.getDate() + 1)

        var timeStampToRefresh = {
            "date": {
                "day": nextDay.getDate(),
                "month": nextDay.getMonth()
            },
            "time": {
                "hours": 1,
                "minutes": 0
            }
        }

        fileData['timeStampToRefresh'] = timeStampToRefresh

        fs.writeFileSync(path.join(__dirname, 'valorantApi/valShop.json'), JSON.stringify(fileData, null, 4))

        
    })
}
function isNewStore(){
    var timeStampToRefresh = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/valShop.json')))["timeStampToRefresh"]

    var timeNow = new Date(Date.now()) 
    // var timeNow = new Date(2021, 7, 4, 18, 35)
    var currentTime = {
        "date": {
            "day": timeNow.getDate(),
            "month": timeNow.getMonth()
        },
        "time": {
            "hours": timeNow.getHours(),
            "minutes": timeNow.getMinutes()
        }
    }

    if(
        currentTime.date.month >= timeStampToRefresh.date.month &&
        currentTime.time.hours >= timeStampToRefresh.time.hours &&
        currentTime.date.day >= timeStampToRefresh.date.day
    ){
        return true
    }
    else{
        return false
    }
}

ipcMain.on('store:req', () => {
    if(isNewStore()){
        getStore()
    }

    const skins = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/valShop.json')))['skins']
    let username = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/config.json')))['USERNAME']

    win.webContents.send('store:res', skins, username)
})

ipcMain.on('bg:req', () => {

    var backgroundPath = path.join(__dirname, 'assets/backgrounds')

    var images = fs.readdirSync(backgroundPath)
    var randomUrl = images[Math.floor(Math.random() * images.length)]

    win.webContents.send('bg:res', randomUrl)

})
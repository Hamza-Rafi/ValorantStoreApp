const { app, BrowserWindow, ipcMain } = require("electron")
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs')

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
    return new Promise((resolve, reject) => {
        var pythonPath = path.join(__dirname, 'valorantApi/getValShop.py')
        exec(`python "${pythonPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            
            console.log(`stdout: ${stdout}`);

            if(stderr){
                console.error(`stderr: ${stderr}`);
            }
            // JSONIFY
            stdout = stdout.replaceAll(`'`, `"`)
            var store = JSON.parse(stdout)
    
            // Save store and timnestamp to file
            let fileData = {}
    
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
    
            fileData['skins'] = store
            fileData['timeStampToRefresh'] = timeStampToRefresh
    
            fs.writeFileSync(path.join(__dirname, 'valorantApi/valShop.json'), JSON.stringify(fileData, null, 4))

            resolve(store)
    
        })
        
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
        console.log('true')
        return true
    }
    else{
        console.log('false')
        return false
    }
}

ipcMain.on('store:req', () => {
    let skins
    let username

    if(isNewStore()){
        getStore().then(store => {
            skins = store
            username = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/config.json')))['USERNAME']
        
            win.webContents.send('store:res', skins, username)
        })
    }
    else{
        skins = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/valShop.json')))['skins']
        username = JSON.parse(fs.readFileSync(path.join(__dirname, 'valorantApi/config.json')))['USERNAME']

        win.webContents.send('store:res', skins, username)
    }

})

ipcMain.on('bg:req', () => {

    var backgroundPath = path.join(__dirname, 'assets/backgrounds')

    var images = fs.readdirSync(backgroundPath)
    var randomUrl = images[Math.floor(Math.random() * images.length)]

    win.webContents.send('bg:res', randomUrl)

})
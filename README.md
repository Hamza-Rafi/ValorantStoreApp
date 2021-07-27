# Valorant Store App
An app that displays your valorant store

## How to install
- Make sure MongoDB Community Server is installed on your machine. Install from [here](https://www.mongodb.com/try/download/community).
- Install the latest release of [Valorant Store App](https://github.com/HamuzaDesu/ValorantStoreApp/releases/tag/v1.0.0) and unzip the file.
- put the `valorantstoreapp-win32-x64` folder in a safe place (Documents file or something)
- Navigate to `valorantstoreapp-win32-x64/resources/app/src` in CMD
- Install python modules by running `pip -r install pythonRequirements.txt`
- Go to `src/valorantApi` and remove the '.example' extension from `config.json.example`
- Enter your Valorant details into `config.json`

- Run `valorantstoreapp-win32-x64/valorantstoreapp.exe`

- If you want maybe right click the .exe file, press `Create shortcut` and move the shortcut into the startup directory (type `shell:startup` into the windows run dialogue (Windows + R))

## How the app works
- When you run the app (bear with it it will take a couple of seconds), a window will launch into the middle of your screen.
- To close the app simply press the 'X' icon in the top right corner
- The app will now minimise to the system tray.
- To reopen the app, double click the system tray icon or right click the system tray icon and click on `Open App`
- To quit the app, right click the system tray icon and choose the `Quit` option.

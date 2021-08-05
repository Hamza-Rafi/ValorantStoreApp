# Valorant Store App
A desktop app that displays your valorant store.

## How to install
- Make sure MongoDB Community Server is installed on your machine. Install from [here](https://www.mongodb.com/try/download/community).
- Install the latest release of [Valorant Store App](https://github.com/HamuzaDesu/ValorantStoreApp/releases/latest) and unzip the file.
- put the `valorantstoreapp-win32-x64` folder in a safe place (Documents file or something)
- Navigate to `valorantstoreapp-win32-x64/resources/app/src` in CMD
- Install python modules by running `pip -r install pythonRequirements.txt`
- Go to `src/valorantApi` and remove the '.example' extension from `config.json.example`
- Enter your Valorant details into `config.json`
- Run `getValShop.py` in `src/valorantApi` (make sure mongoDB is isntalled)

- Create a shortcut of `valorantstoreapp-win32-x64/valorantstoreapp.exe` by right clicking on the file and selecting the `Create Shortcut` option

- Open windows run.exe (press Windows + R)
- Paste in `%programdata%\Microsoft\Windows\Start Menu\Programs`

- Rename the shortcut to whatever you want and then copy or move the shortcut into the Programs folder

- If you want the app to run on PC startup right click the .exe file, copy the shortcut into the startup directory (type `shell:startup` into the windows run dialogue (Windows + R))

- Done!
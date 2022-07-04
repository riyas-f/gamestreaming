const { app, BrowserWindow, desktopCapturer, ipcMain, webContents } = require('electron')

/* Function to create Window */
const createWindow = () => {
    const win = new BrowserWindow({
      width: 600,
      height: 400,

      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        contextIsolation: false
      }
    })

    win.webContents.openDevTools()

    win.loadURL('http://localhost:8000/main.html') /* Load micro server from Python eel */
}

/* Receive's display request */
ipcMain.on('request-display', (event) => {
    desktopCapturer.getSources({ types: ['window', 'screen'] })
    .then(sources => {
        console.log(sources);
        for(i=0; i<sources.length; i++){
            if(sources[i].name === 'Entire Screen'){
                var displaySource = sources[i].id
                /* Reply with displya source (screen0:0) */
                event.sender.send('display', displaySource)
            }
        }
    })
    .catch(e => console.log(e))
})

/* When ready trigger's create window function */
app.whenReady().then(() => {
    createWindow()
})

/* Closes window */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
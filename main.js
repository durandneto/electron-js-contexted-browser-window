const { app, BrowserWindow, ipcMain  } = require ('electron')
const preload = 'preload.js';

var path = `file://${__dirname}`

var win1 = {
    loadURL: `${path}\\index1.html`
    , show: true
    , devTools: true
}

var win2 = {
    loadURL: `${path}\\index2.html`
    , show: true
    , devTools: false
}

var ContextedBrowserWindow = function() { 
    var BWindow = {}
    
    var preferences = {
        width: 600,
        height: 500,
        webPreferences: {
            affinity: 'test_' + Math.random()
            , sandbox: false
            , preload: preload
            , nativeWindowOpen: true
        }
        , show: this.show
    }

    this.create = function() {
        BWindow = new BrowserWindow (preferences)
        BWindow.loadURL(this.loadURL)

        if ( this.devTools )
            BWindow.webContents.openDevTools ()

        BWindow.on('closed', () => { 
            console.log(BWindow)
            this.delete()
        })
    }

    this.delete = function () {
        BWindow = null
        preferences = null
        console.log(BWindow,preferences)
    }
} 

ContextedBrowserWindow.call(win1)
ContextedBrowserWindow.call(win2)

function onAppReady ()
{ 
    win1.create()

    ipcMain.on('openWindow', () => {
        win2.create()
    })
}

app.on ('ready', onAppReady)
app.on ('window-all-closed', () => { app.quit () })



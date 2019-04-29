const electron = require('electron');
const path = require('path');

const { app, Menu, Tray } = electron;

app.on('ready', _ => {
  const tray = new Tray(path.join('src','trayIcon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Now',
      click: _ => console.log('NOW')      
    },
    {
      label: 'Sweet',
      click: _ => console.log('Sweet')      
    }
  ])
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Mein sweet app');
})

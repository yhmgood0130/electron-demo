const electron = require('electron');
const path = require('path');

const { app, globalShortcut, clipboard, Tray, Menu } = electron;

const STACK_SIZE = 5;
const ITEM_MAX_LENGTH = 3;

function formatItem(item) {
  return item && item.length > ITEM_MAX_LENGTH 
    ? item.substr(0, ITEM_MAX_LENGTH) + "..."
    : item;
}

function formatMenuTemplateForStack(clipboard, stack) {
  return stack.map((item, i ) => {
    return {
      label: `Copy: ${formatItem(item)}`,
      click: _ => clipboard.writeText(item),
      accelerator: `CmdOrCtrl+Alt+${i+1}`
    }
  })
}

function checkClipboardForChange(clip, onChange) {
  let cache = clip.readText();
  let latest;
  setInterval(_ => {
    latest = clip.readText();
    if (latest !== cache) {
      cache = latest;
      onChange(cache)
    }
  },1000)
};

function addToStack(item, stack) {
  console.log([item]);
  console.log(stack);
  
  return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1): stack);
}

function registerShortcuts(globalShortcut, clipboard, stack) {
  globalShortcut.unregisterAll();
  for (let i = 0; i < STACK_SIZE; ++i) {
    globalShortcut.register(`CmdOrCtrl+Alt+${i + 1}`, _ => {
      clipboard.writeText(stack[i]);
    })
  }
}

app.on('ready', _ => {
  let stack = [];
  const tray = new Tray(path.join('src', 'trayIcon.png'));
  tray.setContextMenu(Menu.buildFromTemplate([{ label: '<Empty>', enabled: false }]))

  checkClipboardForChange(clipboard, text => {
    stack = addToStack(text, stack)
    console.log(stack);
    
    tray.setContextMenu(Menu.buildFromTemplate(formatMenuTemplateForStack(clipboard, stack)));
    registerShortcuts(globalShortcut, clipboard, stack);
  });
})

app.on('will-quit', _ => {
  globalShortcut.unregisterAll();
})
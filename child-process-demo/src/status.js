const fs = require('fs');
const exec = require('child_process').exec;
const os = require('os');

function isDir(dir) {
  try{
    console.log(dir);
    
    return fs.lstatSync(dir).isDirectory();
  } catch (e) {
    console.log(e);
    
    return false;
  }
}

function checkGitStatus() {
  exec('git status', {
    cwd: dir
  }, (err,stdout, stderr) => {
    console.log("err", err);
    console.log("stdout", stdout);
    console.log("stderr", stderr);

    if (err) return setStatus('unknown')

    if (/nothing to commit/.test(stdout)) return setStatus('clean');

    return setStatus('dirty');    
  })
}

function formatDir(dir) {
  return /^~/.test(dir) ? os.homedir() + dir.substr(1).trim() 
    : dir.trim();
}

function removeStatus() {
  const el = document.getElementById('status');
  el.classList.remove('unknown', 'clean', 'dirty');
  return el;
}

function setStatus(status) {
  removeStatus();
  el.classList.add(status);
}

let timer;

document.getElementById('input').addEventListener('keyup', evt => {
  removeStatus();
  clearTimeout(timer)
  timer = setTimeout(_ => {
    const dir = evt.target.value
    if (isDir(dir)) {
      checkGitStatus(dir);
    }
  }, 500)
})
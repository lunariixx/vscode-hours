const vscode = require('vscode');

/** @type {vscode.StatusBarItem} */
let statusBarItem;
let totalHours;
let interval;

function activate(context) {
  const config = vscode.workspace.getConfiguration('vscodeHoursTracker');
  totalHours = config.get('totalHours', 0);

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = formatHours(totalHours);
  statusBarItem.show();

  startTimer(context);

  let resetCommand = vscode.commands.registerCommand('vscode-hours-tracker.resetTime', () => {
    totalHours = 0;
    updateStatusBar();
    vscode.workspace.getConfiguration('vscodeHoursTracker').update('totalHours', totalHours, vscode.ConfigurationTarget.Global);
  });
  context.subscriptions.push(resetCommand);
}

function startTimer(context) {
  const config = vscode.workspace.getConfiguration('vscodeHoursTracker');
  const updateFrequency = config.get('updateFrequency', 10); 

  if (interval) {
    clearInterval(interval); 
  }

  interval = setInterval(() => {
    totalHours += updateFrequency / 3600; 
    updateStatusBar();

    vscode.workspace.getConfiguration('vscodeHoursTracker').update('totalHours', totalHours, vscode.ConfigurationTarget.Global);
  }, updateFrequency * 1000);
}

function updateStatusBar() {
  statusBarItem.text = formatHours(totalHours); 
}

function formatHours(hours) {
  return `⏲ ${hours.toFixed(2)}`; 
}

function deactivate() {
  if (interval) {
    clearInterval(interval); 
  }
}

module.exports = {
  activate,
  deactivate
};

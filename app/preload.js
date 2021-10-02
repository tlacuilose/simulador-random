// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require('electron');
const Mcm = require('../models/mcm.js');

// Send all models initialized, as translation new Class() is not available in views.
contextBridge.exposeInMainWorld('mcm', new Mcm());

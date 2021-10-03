const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

module.exports = {
  openAndCloseApp: openAndCloseApp
}

function openAndCloseApp() {

  before(function () {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '../..')]
    })
    return this.app.start()
  })

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
}


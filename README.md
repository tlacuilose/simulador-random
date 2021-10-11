# Simulador Random
SemRand es un simulador de números random.
Cuenta con los siguientes generadores:

- MCC: Método de los Centros Cuadrados
- C: Método Congruencial
- CM: Método Congruencial Mixto con validación Teorema de HULL-DOBELL
- M: Generador Multiplicativo
- CLC: Método Congruencial lineal Combinado

*Para los casos MC, MCM y GM se puede validar la aceptación con
las pruebas de Chi-Cuadrada y Kolmogorov-Smirnov.*

## To Use

```bash
# Clone repository 
git clone https://github.com/tlacuilose/simulador-random.git 
# Go into the repository
cd simulador-random
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Testing

To test run:

```
npm test
```

### Unit testing using Mocha and Chai

- [Mocha documentation](https://mochajs.org/#getting-started) - getting started
- [Chai documentation](https://www.chaijs.com/) - documentation
- [Chai documentation](https://www.chaijs.com/guide/styles/#expect) - expect, most common test evaluator

### Integration tests using Spectron

- [Spectron repository](https://github.com/electron-userland/spectron#usage) - usage
- [WebDriver IO Docs](https://webdriver.io/docs/api) - traveling through the html

## About MVVM

- [The Model-View-ViewModel Pattern](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/enterprise-application-patterns/mvvm) - Microsoft

## Object oriented in Javascript

- [Mozilla Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) - classes in javascript

## Writing documentation with JSDoc

- [JSDoc usage](https://jsdoc.app/about-getting-started.html) - getting started, run jsdoc script.js

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)

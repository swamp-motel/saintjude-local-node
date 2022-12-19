const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const driver =  require('@thiagoelg/node-printer');

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,  
  width: 32,
  interface: 'printer:deskprinter',
  characterSet: 'PC437_USA',
  docname: "Leo's Node Printer",
  driver
});

async function getAllPrinters(){
  const allPrinters = await driver.getPrinters();
  for (let printer of allPrinters){
    console.log(printer.name)
  }
}
getAllPrinters(); //Enable to list the printers for a bit of debugging

async function init(){
    let isConnected = await printer.isPrinterConnected();  // Check if printer is connected, return bool of status
    console.log('Connected?', isConnected);
    await printer.printImage('./echo.png');  // Print PNG image
    printer.newLine();
    printer.println("ECHOSUMP STARTING!")
    printer.newLine();
    printer.newLine();
    const result = await printer.execute();  // Executes all the commands. Returns success or throws error
    console.log(result)
}

async function printText(text){
  let isConnected = await printer.isPrinterConnected();  // Check if printer is connected, return bool of status
  printer.clear();
  console.log('Connected?', isConnected);
  printer.println(text)
  printer.newLine();
  printer.newLine();
  await printer.execute();  // Executes all the commands. Returns success or throws error
  console.log('done')
}

module.exports = {init, printText};
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const driver =  require('@thiagoelg/node-printer');

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,  
  width: 32,
  interface: 'printer:STMicroelectronics_POS58_Printer_USB',
  characterSet: 'PC850_MULTILINGUAL',
  docname: "Leo's Node Printer",
  driver
});

async function init(){
    let isConnected = await printer.isPrinterConnected();  // Check if printer is connected, return bool of status
    console.log('Connected?', isConnected);
    await printer.printImage('./echo.png');  // Print PNG image
    printer.newLine();
    printer.println("ECHOSUMP STARTING")
    printer.newLine();
    printer.newLine();
    await printer.execute();  // Executes all the commands. Returns success or throws error
    console.log('done')
}

async function printText(text){
  let isConnected = await printer.isPrinterConnected();  // Check if printer is connected, return bool of status
  printer.clear();
  console.log('Connected?', isConnected);
  printer.newLine();
  printer.println(text)
  printer.newLine();
  await printer.execute();  // Executes all the commands. Returns success or throws error
  console.log('done')
}

module.exports = {init, printText};
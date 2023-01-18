const { print, getPrinters } = require("pdf-to-printer");

async function printPDF(filename){
  // getPrinters()
  //   .then(printers=>{
  //     console.log("Printers",printers)
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   })

  const printer = "Brother TD-4420DN (USB)";
  const options = {
    printer,
    paperSize: "102mm Continuous Roll"
  }
    
  return print(filename, options)
    .then(result => {
      return true;
    })
    .catch(error => {
      console.error(error);
      return false;
    })
}

module.exports = { printPDF }

/*
https://www.computerhope.com/unix/ulp.htm for options
*/
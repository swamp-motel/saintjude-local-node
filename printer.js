const { print, getPrinters } = require("pdf-to-printer");

async function printPDF(filename){
  getPrinters().then(printers=>{
    console.log(printers)
  })
  const printer = "Brother TD-4420DN";
  const options = {
    printer:  "Brother TD-4420DN",
    scale: "fit"
  }
  
  print(filename, options).then(result => {
    return(result)
  });
  //const result = await ptp.print(filename, options);
  //console.log(result);
}

module.exports = { printPDF }

/*
https://www.computerhope.com/unix/ulp.htm for options
*/
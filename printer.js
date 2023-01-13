const { print } = require("pdf-to-printer");

async function printPDF(filename){
  // getPrinters().then(printers=>{
  //   console.log(printers)
  // })
  // const printer = "Brother";
  // const options = ["-o portrait", "-o fit-to-page"];
  print(filename).then(result => {
    return(result)
  });
  //const result = await ptp.print(filename, options);
  //console.log(result);
}

module.exports = { printPDF }

/*
https://www.computerhope.com/unix/ulp.htm for options
*/
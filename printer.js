const { print } = require("pdf-to-printer");

async function printPDF(filename){

  const printer = "Brother TD-4420DN (USB)";
  const options = {
    printer,
    paperSize: "102mm Continuous Roll"
  }
    
  return print(filename, options)
    .then(result => {
      console.log('good print');
      return filename;
    })
}

module.exports = { printPDF }
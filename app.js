const express = require('express');
const path = require('path');
const app = new express();
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});

const printer = require('./printer.js');
const pdf = require('./pdf.js');

app.use(express.urlencoded({ extended : true }));

async function go(){

    const filename = pdf.createStatsPDF({id: '12'});

    console.log(filename);

    const success = await printer.printPDF(filename);

    console.log(success);

}

go();

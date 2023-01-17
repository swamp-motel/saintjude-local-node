const express = require('express');
const path = require('path');
const app = new express();
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});

const printer = require('./printer.js');
const pdf = require('./pdf.js');
const reporter = require('./reporter.js');

app.use(express.urlencoded({ extended : true }));

setInterval(async ()=>{
    const anyJobs = await reporter.report();
    console.log(anyJobs);
    if (anyJobs.length){
        anyJobs.forEach(async job=>{
            const filename = pdf.createStatsPDF(job.payload);
            const success = await printer.printPDF(filename).catch(err => {
                console.error(err);
            });
            console.log('success?', success);
        })
    }
}, 1000)


async function go(){
    const filename = pdf.createStatsPDF({id: '12'});
    console.log('filename', filename);
    const success = await printer.printPDF(filename).catch(err => {
        console.error(err);
    });
    console.log('success?', success);
}

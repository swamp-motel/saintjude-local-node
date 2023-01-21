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
app.set('view engine', 'pug');
app.get('/', async (req, res) => {
    res.render('index', {
        pdfs: await pdf.getListOfPDFs(),
        online: reporter.areWeOnline
    })
});

app.use("/", express.static(__dirname + '/public'))
app.post("/reprint", (req,res) => {
    console.log('reprint requested for ' + req.query.filename);
    printer.printPDF(req.query.filename);
    res.send();
})
app.use("/view", express.static(__dirname + '/output'))

 setInterval(async ()=>{
     const anyJobs = await reporter.report();
     if (anyJobs.length){
         console.log(anyJobs);
         anyJobs.forEach(async job=>{
             let filename;
             if (job.payload == 'testpage'){
                 filename = await pdf.createTestPage();
             } else {
                 filename = await pdf.createStatsPDF(job.payload);
             }
             console.log("Filename from PDF Generator:", filename)
             const success = await printer.printPDF(filename).catch(err => {
                 console.error(err);
             });
             console.log('success?', success);
         })
     }
 }, 3000)
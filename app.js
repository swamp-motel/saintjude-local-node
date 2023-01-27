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
const { resourceLimits } = require('worker_threads');

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

const jobHistory = []

 setInterval(async ()=>{
     const anyJobs = await reporter.report(jobHistory);
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
             const result = await printer.printPDF(filename).catch(err => {
                return {error: err}
             });
             
             if (result.error){
                console.error('ERROR', result.error)
                jobHistory.push({message: result.error, sender:'ERROR', timestamp: Date.now()})
             } else {
                console.log('PRINTED', result)
                jobHistory.push({message: result, sender:'JOB', timestamp: Date.now()})
             }
         })
     }
 }, 3000)
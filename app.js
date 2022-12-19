const express = require('express');
const path = require('path');
const app = new express();
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log("Listening on port %s...", server.address().port);
});

const printer = require('./printer.js');
printer.init();
app.use(express.urlencoded({ extended : true }));

app.post('/print/text', (req, res) => {
    console.log(req.body);
    printer.printText(req.body.message)
    res.status(200).send();
})

app.post('/print/image', (req, res) => {
    res.status(200).send();
})


//app.use(express.static(path.join(__dirname, 'public')));



function addLeadingZero(input){
    if (input.length == 1){
        return '0' + input;
    }
}
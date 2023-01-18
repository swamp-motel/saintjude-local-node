const fs = require('fs');
const { resolve } = require('path');
const PDFDocument = require('pdfkit');

const pageHeight = 434; //434pt = 152mm
const pageWidth = 291; // 291pt = 102mm

const contentWidth = pageWidth - 20;
const contentMargin = 10;


function createTestPage(){
    const doc = new PDFDocument({
        size: [pageWidth,pageHeight],
        margins : {
            top: 10,
            bottom:10,
            left: 10,
            right: 10
        }
    });

    doc.pipe(fs.createWriteStream('./output/test.pdf')); // write to PDF

    //SETUP STYLES
    doc.font('assets/Perfect DOS VGA 437.ttf')
    
    //BORDER
    doc.lineWidth(8)
        .rect(0, 0, pageWidth, pageHeight)
        .stroke();

    //ECHOSUMP
    doc.image('assets/echo.png', contentWidth/2 - 64, 16, {width: 128, align: 'center'})

    doc.x = contentMargin;
    doc.y = 64;
    doc.fontSize(16)
        .text('TEST PAGE', {width: contentWidth, align: 'center'})
        .text(new Date(), {width: contentWidth, align: 'center'});



    doc.end();

    return './output/test.pdf';

}

function createStatsPDF(job){
    return new Promise((resolve,reject) => {
        console.log(job);

        //RENDER SOME PRINTABLE DATA
        //totalTime, dateToPrint, startTimeToPrint, endTimeToPrint, uuid, remarksToPrint
        const totalTime = `${Math.floor(job.duration / 1000 / 60)} mins`
        const startDate = new Date(job.startTime);
        const endDate = new Date(job.endTime);
        const date = startDate.getDate();
        const month = startDate.getMonth(); 
        const year = startDate.getFullYear();
        const dateToPrint = pad(date) + "-" + pad(month + 1) + "-" + year;
        const startTimeToPrint = pad(startDate.getHours()) + ":" + pad(startDate.getMinutes())
        const endTimeToPrint = pad(endDate.getHours()) + ":" + pad(endDate.getMinutes())
        const uuid = job.uuid;
        
        let remarksToPrint;
        if (job.remarks.length <= 3){
            remarksToPrint = new Set(job.remarks);
        } else {
            while (remarksToPrint.size < 3) {
                const item = getRandomItem(job.remarks);
                remarksToPrint.add(item);
            }
        }
        
        const doc = new PDFDocument({
            size: [pageWidth,pageHeight],
            margins : {
                top: 10,
                bottom:10,
                left: 10,
                right: 10
            }
        });
        
        const filename = `./output/${job.uuid}_${Date.now()}.pdf`
        const writeStream = fs.createWriteStream(filename);
        writeStream.on('finish', function () {
            resolve(filename);
        });
        doc.pipe(writeStream); // write to PDF


        //SETUP STYLES
        doc.font('assets/Perfect DOS VGA 437.ttf')
        
        //BORDER
        doc.lineWidth(8)
            .rect(0, 0, pageWidth, pageHeight)
            .stroke();

        //ECHOSUMP
        doc.image('assets/echo.png', contentWidth/2 - 64, 16, {width: 128, align: 'center'})

        //ID
        doc.x = contentMargin;
        doc.y = pageHeight - 48;
        doc.fontSize(32)
        doc.text(uuid, {width: contentWidth, align: 'left'});

        //THANK YOU
        doc.x = contentMargin;
        doc.y = 64;
        doc.fontSize(16)
            .text('THANK YOU FOR VOLUNTEERING AT SAINT JUDE', {width: contentWidth, align: 'center'});


        //TIMING INFO
        doc.x = contentMargin;
        doc.y = 128;
        doc.fontSize(12);
        doc.text(`Date: ${dateToPrint}`, {width: contentWidth, align: 'left'});
        //doc.moveDown();
        doc.text(`Time Started: ${startTimeToPrint}`, {width: contentWidth, align: 'left'});
        //doc.moveDown();
        doc.text(`Time Finished: ${endTimeToPrint}`, {width: contentWidth, align: 'left'});
        //doc.moveDown();
        doc.text(`Session Duration: ${totalTime}`, {width: contentWidth, align: 'left'});
        doc.moveDown();

        //REMARKS
        doc.x = contentMargin;
        doc.y = 196;
        doc.fontSize(12);
        for (let remark of remarksToPrint){
            doc.text(`${remark.text}`)
            doc.moveDown();
        }

        //QR CODE
        doc.image('assets/postshow_qr.png', pageWidth - 64, pageHeight -64, {width: 48})

        // finalize the PDF and end the stream
        doc.end();
    })
}

module.exports = { createStatsPDF, createTestPage }



function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

function pad(n) {
    return n<10 ? '0'+n : n;
}
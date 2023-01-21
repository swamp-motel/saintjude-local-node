const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const pdfFileStore = __dirname + '/output/';

const pageHeight = 434; //434pt = 152mm
const pageWidth = 291; // 291pt = 102mm

const contentWidth = pageWidth - 20;
const contentMargin = 10;


async function createTestPage(){
    const doc = new PDFDocument({
        size: [pageWidth,pageHeight],
        margins : {
            top: 10,
            bottom:10,
            left: 10,
            right: 10
        }
    });

    doc.pipe(fs.createWriteStream(pdfFileStore + 'test.pdf')); // write to PDF

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

    return pdfFileStore + 'test.pdf';

}

async function createStatsPDF(job){
    return new Promise(async (resolve,reject) => {
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
        
        let remarksToPrint = new Set();
        if (job.remarks){
            if (job.remarks.length <= 6){
                remarksToPrint = new Set(job.remarks);
            } else {
                while (remarksToPrint.size < 6) {
                    const item = getRandomItem(job.remarks);
                    remarksToPrint.add(item);
                }
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
        
        const filename = `${pdfFileStore}${job.uuid}_${Date.now()}.pdf`
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
        doc.image('assets/echo.png', 0, 16, {fit: [pageWidth, 32], align: 'center'})

        //THANK YOU
        doc.x = contentMargin;
        doc.y = 64;
        doc.fontSize(16)
            .text('THANK YOU FOR VOLUNTEERING AT SAINT JUDE', {width: contentWidth, align: 'center'});

        //TIMING INFO
        doc.x = contentMargin;
        doc.y = 120;
        doc.fontSize(10);
        doc.text(`Date: ${dateToPrint}`, {width: contentWidth, align: 'center'});
        doc.text(`Time Started: ${startTimeToPrint}`, {width: contentWidth, align: 'center'});
        doc.text(`Time Finished: ${endTimeToPrint}`, {width: contentWidth, align: 'center'});
        doc.text(`Session Duration: ${totalTime}`, {width: contentWidth, align: 'center'});
        doc.lineWidth(2)
            .rect(48, 116, pageWidth - 48 - 48, 48)
            .stroke();

        //REMARKS
        doc.y = 190;
        let currentY = 190;
        doc.fontSize(10);

        for (let remark of remarksToPrint){
            doc.x = contentMargin + 4;
            if (remark.image){
                const imageFile = `${__dirname}/assets/icons/${remark.image}`;
                const exists = await fileExists(imageFile);
                console.log(exists)
                if (exists){
                    doc.image(imageFile, doc.x, doc.y, {fit: [20, 20]});
                    doc.y -= 20;
                }
            }
            doc.x = 44;
            doc.text(`${remark.text}`)
            currentY += 28;
            doc.y = currentY; //Move down
        }

        //ID
        doc.x = contentMargin + 4;
        doc.y = pageHeight - 42;
        doc.fontSize(32)
        doc.text(uuid, {width: contentWidth, align: 'left'});


        //QR CODE
        doc.image('assets/postshow_qr.png', pageWidth - 64, pageHeight -64, {width: 48})

        // finalize the PDF and end the stream
        doc.end();
    })
}

async function getListOfPDFs(){
    const files = await getSortedFiles(pdfFileStore);
    return files;
}

module.exports = { createStatsPDF, createTestPage, getListOfPDFs }

const getSortedFiles = async (dir) => {
    const files = await fs.promises.readdir(dir);
  
    return files
      .map(fileName => ({
        name: fileName.split("_")[0],
        time: fs.statSync(`${dir}/${fileName}`).mtime.getTime(),
        filename: dir + fileName,
        shortFilename: fileName
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0,20) //ONLY GET MOST RECENT 20 FILES
  };

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

function fileExists(filename){
    console.log(filename)
    const exists = fs.promises.access(filename, fs.F_OK)
      .then(()=>{return true})
      .catch(err => {return false})
    return exists;
}
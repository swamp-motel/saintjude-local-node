const fs = require('fs');
const PDFDocument = require('pdfkit');

function createStatsPDF({id}){
    
    const pageHeight = 434; //434pt = 152mm
    const pageWidth = 291; // 291pt = 102mm

    const doc = new PDFDocument({
        size: [pageWidth,pageHeight],
        margins : {
            top: 10,
            bottom:10,
            left: 10,
            right: 10
        }
    });
    

    doc.pipe(fs.createWriteStream('./output/demo.pdf')); // write to PDF

    //SETUP STYLES
    doc.font('assets/Perfect DOS VGA 437.ttf')
    
    //BORDER
    doc.lineWidth(8)
        .rect(0, 0, pageWidth, pageHeight)
        .stroke();

    //ECHOSUMP
    doc.image('assets/echo.png', pageWidth/2 - 64, 16, {width: 128, align: 'center'})

    //ID
    doc.x = 0;
    doc.y = 16;
    doc.fontSize(32)
        .text(id, {width: pageWidth, align: 'right'});

    //TITLE
    doc.x = 0;
    doc.y = 64;
    doc.fontSize(16)
        .text('THANK YOU FOR VOLUNTEERING AT SAINT JUDE', {width: pageWidth, align: 'center'});


    doc.x = 0;
    doc.y = 128;
    doc.fontSize(12)
        .text("I FUCKING HATE PRINTERS DON'T I TIFF BUT HERE I AM AGAIN PROGRAMMING A BLOODY PRINTER", {width: pageWidth, align: 'center'});




    //QR CODE
    doc.image('assets/postshow_qr.png', pageWidth - 64, pageHeight -64, {width: 48})

    // finalize the PDF and end the stream
    doc.end();

    return './output/demo.pdf';
}

module.exports = { createStatsPDF }
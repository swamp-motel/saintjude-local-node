const fs = require('fs');
const PDFDocument = require('pdfkit');

function createStatsPDF(){
    
    const pageHeight = 145;
    const pageWidth = 102;

    const doc = new PDFDocument({
        size: [pageWidth,pageHeight],
        margins : {
            top: 10,
            bottom:10,
            left: 10,
            right: 10
        }
    });
    

    doc.pipe(fs.createWriteStream('./demo.pdf')); // write to PDF

    //SETUP STYLES
    doc.font('assets/Perfect DOS VGA 437.ttf')
    
    //BORDER
    doc.rect(0, 0, pageWidth, pageHeight).stroke();

    //TITLE
    doc.font = 
    doc.fontSize(4);
    doc.x = 0;
    doc.y = 4;
    doc.text('THANK YOU FOR VOLUNTEERING AT SAINT JUDE', {width: pageWidth, align: 'center'});

    //QR CODE
    doc.image('assets/postshow_qr.png', pageWidth - 20, pageHeight -20, {width: 15})


    // finalize the PDF and end the stream
    doc.end();

    return 'demo.pdf';
}

module.exports = { createStatsPDF }
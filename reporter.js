const axios = require('axios')
const reportIntervalMs = 500;
let myUUID = 'printer';
let myIdentifier = 'printer';
let sequenceNumber = 0;

exports.report = async () => {
    const submission = {
        uuid: myUUID,
        identifier: myIdentifier,
        special: 'printer',
        conversation: [],
        sequenceNumber,
    }
    sequenceNumber++
    
    const response = await axios.post("https://backstage.saintjude.ai/api/reports", submission).catch(err=>{
        console.error('Could not connect to server');
        return false;
    });
    
    if (response.data.jobs){
        response.data.jobs.forEach(job => {
            console.log('I had a job to do!');
            console.log(job.payload);
            axios.delete(`https://backstage.saintjude.ai/api/jobs/${job.id}`);
        })
        return response.data.jobs;
    } else {
        return false;
    }
}


exports.raiseAlert = payload => {
    const submission = {
        uuid: myUUID,
        payload
    }
    axios.post("https://backstage.saintjude.ai/api/alerts", submission);
}
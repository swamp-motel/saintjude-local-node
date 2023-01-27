const axios = require('axios')
let myUUID = 'printer';
let myIdentifier = 'printer';
let sequenceNumber = 0;

exports.report = async (jobHistory) => {
    const submission = {
        uuid: myUUID,
        identifier: myIdentifier,
        special: 'printer',
        conversation: {messages: jobHistory},
        sequenceNumber,
    }
    sequenceNumber++
    
    const response = await axios.post("https://backstage.saintjude.ai/api/reports", submission).catch(err=>{
        console.error('Could not connect to server');
        this.areWeOnline = false;
        return false;
    });
    this.areWeOnline = true;
    if (response.data && response.data.jobs){
        response.data.jobs.forEach(job => {
            console.log('I had a job to do!');
            console.log(job.payload);
            axios.delete(`https://backstage.saintjude.ai/api/jobs/${job.id}`).catch(err => {
                console.error('Unable to delete the job I just received')
            });
        })
        return response.data.jobs;
    } else {
        return false;
    }
}

exports.areWeOnline = false;


exports.raiseAlert = payload => {
    const submission = {
        uuid: myUUID,
        payload
    }
    axios.post("https://backstage.saintjude.ai/api/alerts", submission);
}
var express = require('express');
var router = express.Router();
var connection = require('../db/dbConnection');

const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueURL = "https://sqs.us-east-1.amazonaws.com/981728932529/urbanWearQueueMain";

const params = {
    QueueUrl: queueURL,
    MaxNumberOfMessages: 5,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};

router.get('/', async (req, res) => {
    try {
        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            const notifications = data.Messages.map(message => {
                return message.Body;
            });

            for (const message of data.Messages) {
                const deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: message.ReceiptHandle
                };
                await sqs.deleteMessage(deleteParams).promise();
            }

            res.json({ notifications });
        } else {
            res.json({ message: 'No new notifications' });
        }
    } catch (err) {
        console.error("Error fetching notifications", err);
        res.status(500).send('Error fetching notifications');
    }
});

module.exports = router;
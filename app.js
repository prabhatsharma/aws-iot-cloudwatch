/***
 * This lambda function will act on the incoming data from raspberry pi and push it to cloudwatch metrics.
 * 
 */

const AWS = require('aws-sdk');


exports.handler = (event, context, callback) => {
    console.log(event)
    const metric = {
        MetricData: [
            {
                MetricName: 'fahrenheit',
                Dimensions: [
                    {
                        Name: 'Home',
                        Value: "fahrenheit"
                    }
                ],
                Timestamp: new Date(),
                Unit: 'Count',
                Value: event.fahrenheit
            },
            {
                MetricName: 'celsius',
                Dimensions: [
                    {
                        Name: 'Home',
                        Value: "celsius"
                    }
                ],
                Timestamp: new Date(),
                Unit: 'Count',
                Value: event.celsius
            },
            {
                MetricName: 'humidity',
                Dimensions: [
                    {
                        Name: 'Home',
                        Value: "percentage"
                    }
                ],
                Timestamp: new Date(),
                Unit: 'Percent',
                Value: event.humidity
            }
        ],

        Namespace: 'raspberry'
    };

    const cloudwatch = new AWS.CloudWatch({ region: 'us-west-2' });

    console.log('about to insert data in cloudwatch')
    cloudwatch.putMetricData(metric, (err, data) => {
        console.log('putmetric executed')
        if (err) {
            console.log('failed to insert data in cloudwatch')
            console.log(err, err.stack); // an error occurred
            callback(err.stack)
        } else {
            console.log('inserted data in cloudwatch')
            console.log(data);           // successful response
        }
    });
};

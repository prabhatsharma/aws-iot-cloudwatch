
const https = require('https');
const AWS = require('aws-sdk');
let url = "https://api.openweathermap.org/data/2.5/weather?APPID=<your API key>&q=Fremont,ca,us"

exports.handler = function (event, context, callback) {

    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            let weather = JSON.parse(data)

            var event = {
                celsius: Math.round(weather.main.temp - 273, 2), // base data is in kelvin. convert it to celsius
                fahrenheit: Math.round((weather.main.temp - 273) * 9 / 5 + 32, 2),
                humidity: weather.main.humidity
            }


            const metric = {
                MetricData: [
                    {
                        MetricName: 'fahrenheit',
                        Dimensions: [
                            {
                                Name: 'Fremont/CA/US',
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
                                Name: 'Fremont/CA/US',
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
                                Name: 'Fremont/CA/US',
                                Value: "percentage"
                            }
                        ],
                        Timestamp: new Date(),
                        Unit: 'Percent',
                        Value: event.humidity
                    }
                ],

                Namespace: 'openweathermap'
            };

            const cloudwatch = new AWS.CloudWatch({ region: 'us-west-2' });

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

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

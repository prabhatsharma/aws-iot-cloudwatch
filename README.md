#  Lambda functions to send home and outside weather data to cloudwatch


### app.js

raspberry pi -> AWS IoT -> Rule to act > app.js lambda fnuction -> cloudwatch metrics


### weather.js

cloudwatch events (scheduled to trigger every 1 minute) -> weather.js lambda function (pulls data from openweathermap) -> cloudwatch metrics


raspberry pi code to push data is at https://github.com/prabhatsharma/raspberry-dht22


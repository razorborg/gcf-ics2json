# ics2json #

A Google Cloud Function for returning lists of iCal events as a JSON object.

## Configure CORS ##

Update the `corsOptions` variable to the appropriate CORS configuration before deploying the function.

## Deploying to Google Cloud ##

This project assumes you are deploying the function to Google Cloud with an HTTP(S) trigger.

Follow the instructions in the Google Cloud documentation to deploy to your Google Cloud project:

https://cloud.google.com/functions/docs/deploying/

This may also work as-is with Firebase. I have not tested that.

## Function ##

`ics2json`

## GET Parameters ##

 - `ics`
   - iCal URL
 - `filter`
   - (optional) `future`, `past`
   - default: show all events
 - `count`
   - Number of items to return
   - Default 100

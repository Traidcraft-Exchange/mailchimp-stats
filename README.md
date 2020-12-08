# Get Mailchimp open and click rates for all emails

A node script to get all open rates and click rates for all emails

You'll need to have Node installed.

Copy `variables.env.example` and take off the `.example` bit off the end to make a file called `variables.env`

Add your Mailchimp API key and your server prefix to the `variables.env` file

In a terminal, open this folder.

Run `npm install`

Run `npm start`

A file called `output.csv` is created with the name, day, time, open rate, click rate, and report URL for every email you've sent.
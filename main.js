import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({ path: "variables.env" });
import mailchimp from "@mailchimp/mailchimp_marketing";
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const API_KEY = process.env.API_KEY;
const SERVER_PREFIX = process.env.SERVER_PREFIX;

mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER_PREFIX,
});

const run = async () => {
  try {
    const response = await mailchimp.reports.getAllCampaignReports({
      // count: 1,
      count: 1000,
      // I don't know why but when I specify which fields to return it returns nothing.
      //   fields: [
      //     "id",
      //     "campaign_title",
      //     "send_time",
      //     "opens.open_rate",
      //     "clicks.click_rate",
      //   ],
    });
    const allData = response.reports;
    // console.log(allData);

    const weekdayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const convertSendTimeToRange = (hour) => {
      if (hour >= 6 && hour <= 8) {
        return "6am - 9am";
      } else if (hour >= 9 && hour <= 11) {
        return "9am - 12noon";
      } else if (hour >= 12 && hour <= 14) {
        return "12noon - 3pm";
      } else if (hour >= 15 && hour <= 17) {
        return "3pm - 6pm";
      } else if (hour >= 18 && hour <= 20) {
        return "6pm - 9pm";
      } else if (hour >= 21 && hour <= 23) {
        return "9pm - midnight";
      } else if (hour >= 0 && hour <= 2) {
        return "midnight - 3am";
      } else if (hour >= 3 && hour <= 5) {
        return "3am - 6am";
      }
    };

    const round = (num) => {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const data = allData.map((email) => ({
      title: email.campaign_title,
      day: weekdayNames[new Date(email.send_time).getDay()],
      time: convertSendTimeToRange(new Date(email.send_time).getHours()),
      open_rate: round(email.opens.open_rate * 100),
      click_rate: round(email.clicks.click_rate * 100),
      url: `https://${SERVER_PREFIX}.admin.mailchimp.com/reports/summary?id=${email.id}`,
    }));

    // console.log(data);

    const csvWriter = createCsvWriter({
      path: "output.csv",
      header: [
        { id: "title", title: "TITLE" },
        { id: "day", title: "DAY" },
        { id: "time", title: "TIME" },
        { id: "open_rate", title: "OPEN_RATE" },
        { id: "click_rate", title: "CLICK_RATE" },
        { id: "url", title: "URL" },
      ],
    });

    csvWriter.writeRecords(data).then(() => {
      console.log("...Done");
    });
  } catch (error) {
    console.log(error);
  }
};

run();

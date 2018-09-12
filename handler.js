// import Scraper from './src/scraper';
// import Slacker from './src/slack';
// import moment from 'moment';
// const moment = require("moment");
const scrapeIt = require("scrape-it");
var AWS = require("aws-sdk");

class Scraper {

  async run() {
     return scrapeIt("https://sellout.woot.com/plus/whack-a-deal", {
        data: {
          listItem: ".info",
          title: {
            selector: 'h2'
          },
        }
    });
  }
};

// var today = new Date();
// var dd = today.getDate();

module.exports.wootscrape = async (event, context) => {
  try {

    const controller = new Scraper();
    // const today = moment().day()-1;
    const res = await controller.run();

    // console.log(today);
    // console.log(res);
    const response = res['data'];

    if (JSON.stringify(response).includes("Crap")) {
      // console.log(`Scraper Response is: ${JSON.stringify(response)}`);
      console.log('Yep!');
      var sns = new AWS.SNS();
      var params = {
        Message: "Go get that BoC!", 
        Subject: "BoC Exists!",
        TopicArn: "***REMOVED***"
      };
      sns.publish(params, context.done);
    } else {
      console.log('Nope');
    }

    console.log('succeed');

    return context.succeed({ statusCode: 200, body: response, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
     console.log('fail');
    console.log(`Application ERROR: ${e.stack}`);
    return context.fail({ statusCode: 500, body: `Application Error: ${e}`, headers });
  }
};

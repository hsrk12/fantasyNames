// netlify/functions/teamNames.js

const { gptCall } = require('./gptCall');
const sqlite = require('sqlite3').verbose();

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { selectedSport } = JSON.parse(event.body);
        console.log(selectedSport);

        const prompt = "You are a sports fanatic. Come up with 25 creative team names for the following sport using clever puns, team/player/coach names. At least half the names must use player/team/coach names: " + selectedSport + ". ensure that your output is formatted as a javascript array";
        const finalist = await gptCall();

        console.log(finalist);

        const db = new sqlite3.Database('activity.db');
        const sql = `INSERT INTO Activity(Sport, GPT_Response) VALUES (?,?)`;
        db.run(sql, [selectedSport, finalist], function(err) {
            if (err) {
                console.log("ERROR unable to insert rows");
            }
            db.close();
        });

        // Return the response
        return {
            statusCode: 200,
            body: JSON.stringify(finalist)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: 'Internal Server Error'
        };
    }
};

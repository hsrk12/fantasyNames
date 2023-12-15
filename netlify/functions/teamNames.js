const sqlite = require('sqlite3').verbose();
const OpenAI = require("openai");

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { selectedSport } = JSON.parse(event.body);
    const prompt = "You are a sports fanatic. Come up with 25 creative team names for the following sport using clever puns, team/player/coach names. At least half the names must use player/team/coach names: " + selectedSport + ". ensure that your output is formatted as a javascript array";
    
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-4-0613",
    });
    const finalist = completion.choices[0]?.message?.content;

    let db = new sqlite.Database('../../activity.db', sqlite.OPEN_READWRITE, (err) => {
        if(err){
            console.error(err.message);
        }
    });

    const sql = `INSERT INTO Activity(Sport, GPT_Response) VALUES (?,?)`;
    db.run(sql, [selectedSport, finalist], function(err) {
        if (err) {
            console.error("ERROR unable to insert rows");
        }
        db.close();
    });

    return {
        statusCode: 200,
        body: JSON.stringify(finalist)
    };
};

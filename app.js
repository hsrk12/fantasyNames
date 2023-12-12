const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(express.static(__dirname)); 
const OpenAI = require("openai");
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  var prompt = "";
  app.post('/teamNames', async (req, res) => {
    // Simulate fetching data from a database or an external API
    //res.json(gpt response)
    const sport = req.body.selectedSport;
    console.log(sport);
    console.log(req.body.selectedSport);
    prompt = "You are a sports fanatic. Come up with 25 creative team names for the following sport using clever puns, team/player/coach names: " + sport + ". ensure that your output is formatted as a javascript array" ;
    var finalist =  await gptCall();
    console.log(finalist);
    res.json(finalist);
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
  })

  //chatGPT API Call
  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

  async function gptCall() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4-0613",
  });

  //console.log(completion.choices[0]?.message?.content);
  return completion.choices[0]?.message?.content;
}
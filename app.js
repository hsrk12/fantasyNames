const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.use(express.static(__dirname)); 
const OpenAI = require("openai");
const { create } = require('domain');
const { error } = require('console');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://main--fantasy-team-names.netlify.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('activity.db', sqlite.OPEN_READWRITE, (err) => {
    if(err){
        return console.log(err.message);    
    }
    console.log('Connected to the in-memory SQlite database.');
});

// const createTable = 'CREATE TABLE Activity(ID INTEGER PRIMARY KEY, Sport STRING, GPT_Response)';
// db.run(createTable);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  var prompt = "";
  app.post('/teamNames', async (req, res) => {
    const sport = req.body.selectedSport;
    console.log(sport);
    console.log(req.body.selectedSport);
    prompt = "You are a sports fanatic. Come up with 25 creative team names for the following sport using clever puns, team/player/coach names: " + sport + ". ensure that your output is formatted as a javascript array" ;
    var finalist =  await gptCall();
    console.log(finalist);
    res.json(finalist);

    const sql = `INSERT INTO Activity(Sport, GPT_Response) VALUES (?,?)`
    db.run(sql, [sport, finalist], function(err){
      if(err){
        console.log("ERROR unable to insert rows");
      }
    });

  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
  })

  app.get('/data', (req, res) => {
    const sql = "SELECT * FROM Activity";
    db.all(sql, [], (error, data) => {
      console.log(data);
    });
    
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
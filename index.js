const { Configuration, OpenAIApi } = require('openai');

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express')

const app = express();
require('dotenv').config();

const ApiKey = process.env.api_key;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({urlencoded: false}));

const configuration = new Configuration({
    apiKey: ApiKey,
});

let port = process.env.PORT || 3001;
const openai = new OpenAIApi(configuration);
// console.log(openai);
// const response = await openai.listEngines();


app.get('/', async (req, res) => {
    // console.log(req.body);
    // let prompt = req.body;
    // let text = runPrompt(prompt);
    // // console.log(text);
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/form-respone', async (req,res)=>{
    let {userName, designation, currentWork, skills , project, description, gitHub, linkedIn, twitter, linkTree, recipientName, recipientMail } = req.body
     let prompt = `I am ${userName} write my name and introduce me. doing ${currentWork} help me by explaining what i do with good vocabulary and impressive sentences, write the body a high quality best grammatical cold mail increasing my chances of getting a response back from the recipient to ${recipientName} asking for an oppurtunity and in ${designation}, i have these skills ${skills} and have done this project ${project} and here is a small description about me '${description} description must be clearly understood by the reader and highly impressive' - give me only the body of the cold mail without any greetings and closing or complimentry part, keeping reader hooked and with good vocabulary and please dont give me new line characters in the beggining i dont need the space `;
     //let prompt = `I am ${userName} write my name and introduce me. write a description of me with high vocabulary and impressive. don't use same sentences repeatedly ${description}, give me the body of the mail and reader must be happy and satisfied without the greetings and complimentry or closing part. don't use same sentences repeatedly`;
    
    // console.log(prompt);
    // let subjectRequest = ``;
    let text = await runPrompt(prompt);
    // text = text.trim();
    let subject = `Requesting an oppurtunity as an ${designation} in your company`;
    // console.log(subject);
    // subject = subject.trim();
    // console.log(text);
    let mailDetails = {
        userName,
        subject,
        text,
        gitHub,
        linkedIn,
        twitter,
        linkTree,
        recipientName,
        recipientMail
    }
    // console.log(req.body);
    // let mailDetails = JSON.stringify(mailDetail);
    // let mailDetails = JSON.parse(mailDetailStringy);
    // console.log(mailDetail);
    // console.log(mailDetails)
    res.render('mailSender', {mailDetails});
})

app.post('/form-response-voice', async (req,res)=>{
    let {userName2, designation2, description2, gitHub2,linkedIn2, twitter2,linkTree2, recipientName2, recipientMail2 } = req.body;
    // let prompt = `I am ${userName2} and with this description of mine please write a high vocabulary and good grammer ${description2}, give me only the body of the mail without the greetings and complimentry or closing part`;
    let prompt = `I am ${userName2} write my name and introduce me. write a description of me with high vocabulary and impressive ${description2}, give me the body of the mail and reader must be happy and satisfied without the greetings and complimentry or closing part.`;
    let text = await runPrompt(prompt);
    let subject = `Requesting an oppurtunity as an ${designation2} in your company`;
    let mailDetails = {
        userName: userName2,
        subject,
        text,
        gitHub: gitHub2,
        linkedIn: linkedIn2, 
        twitter: twitter2,
        linkTree: linkTree2,
        recipientName: recipientName2,
        recipientMail: recipientMail2
    }
    res.render('mailSender', {mailDetails});
})

// app.get('/mailSender', (req, res)=>{

// })

app.listen(port, ()=>{
    console.log(`listening port ${port}`);
})
const runPrompt = async (_prompt)=>{
    

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: _prompt,
        max_tokens: 2000,
        temperature: 1
    })
    return (response.data.choices[0].text);    
}


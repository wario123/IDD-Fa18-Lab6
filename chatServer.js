/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('49e51f7b39bb4cd8913e64ff52884e6f');


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  var previous_input = 'business';
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hello I am NewsBot! a simple chat bot that will provide you with today's top news!"); //We start with the introduction;
    setTimeout(timedQuestion, 3000, socket, "What are you interested in? \n business, entertainment, health, science, sports, or everything!"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    // questionNum = bot(data, socket, questionNum); // run the bot function with the new message
    bot_data = bot(data, socket, questionNum, previous_input); // run the bot function with the new message
    questionNum = bot_data[0];
    previous_input = bot_data[1];
    console.log("we are here");
    console.log(questionNum);
    console.log(previous_input);

  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum, previous_input) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  console.log(previous_input);
  console.log(questionNum);
  if (questionNum == 0) {
    if (input.toLowerCase() == 'business'){
      getNews(questionNum, socket, 'business');
    }
    else if (input.toLowerCase() == 'entertainment'){
      getNews(questionNum, socket, 'entertainment');
      previous_input = input.toLowerCase();
    }
    else if (input.toLowerCase() == 'health'){
      getNews(questionNum, socket, 'health');
      previous_input = input.toLowerCase();
    }
    else if (input.toLowerCase() == 'science'){
      getNews(questionNum, socket, 'science');
      previous_input = input.toLowerCase();
    }
    else if (input.toLowerCase() == 'sports'){
      getNews(questionNum, socket, 'sports');
      previous_input = input.toLowerCase();
    }
    // previous_input = input.toLowerCase();

    else if (input.toLowerCase() == 'everything'){
      getNews(questionNum, socket, '');
      previous_input = '';
    }
    else {
      question = "You did not enter a valid input, what are you interested in? \n business, entertainment, health, science, sports, or everything!"
      setTimeout(timedQuestion, waitTime, socket, question);
      return [0, previous_input];
    }


  } else if (questionNum >= 1 && questionNum <20) {
    if (input.toLowerCase() == 'yes'){
      getNews_article(questionNum-1, socket, previous_input);
      return [questionNum, previous_input]

    }
    else if (input.toLowerCase() == 'no'){
      getNews(questionNum, socket, previous_input);
      return [(questionNum+1), previous_input]
    }
    else {
      getNews(questionNum-1, socket, previous_input);
      return [(questionNum), previous_input]
    }


  } else {
    answer = 'I have nothing more to suggest! Maybe a different topic!'; // output response
    waitTime = 2000;
    question = 'What are you interested in? \n business, entertainment, health, science, sports, or everything! ';
    socket.emit('answer', answer);
    setTimeout(timedQuestion, waitTime, socket, question);
    return [0, previous_input];
  }

  return [(questionNum + 1), previous_input];



}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}

function getNews(question_number, socket,  topic){

  var responses =  newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us',
    category: topic
  }).then((response) => {
    answer =  response.articles[question_number].title;
    socket.emit('answer', answer);
    // setTimeout(timedQuestion, waitTime, socket, question);
    // return (questionNum + 1);
    waitTime = 1;
    if (question_number == 0){
      question = answer + ' -- ' + 'Would you like to read this article? ("yes" to read, "no" to see the next article)';
    }
    else{
      question = answer + ' -- ' + 'Would you like to read this article? ("yes" to read, "no" to see the next article)';
    }
    setTimeout(timedQuestion, waitTime, socket, question);
    // return (questionNum + 1);
  });

}

function getNews_article(question_number, socket,  topic){
  var responses =  newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us',
    category: topic
  }).then((response) => {
    answer =  response.articles[question_number].url;
    socket.emit('answer', answer);
    // setTimeout(timedQuestion, waitTime, socket, question);
    // return (questionNum + 1);
    waitTime = 1;
    if (question_number == 0){
      question = answer + '----------' + 'Copy and paste this URL into a web browser to read this article or enter NO to see the next article';
    }
    else{
      question = answer + '----------' + 'Copy and paste this URL into a web browser to read this article or enter NO to see the next article';
    }
    setTimeout(timedQuestion, waitTime, socket, question);
    // return (questionNum + 1);
  });
}

//----------------------------------------------------------------------------//

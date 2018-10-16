# ChatBot

*A lab report by Karim Arem*


## Make the ChatBot your own

**Describe what changes you made to the baseline chatbot here. Don't forget to push your modified code to this repository.**

My chatbot is a NewsBot! It will give you the top real-time headline news based on a specific category inputed. The Wall Street Journal news api was installed into the Raspberry Pi. newsapi objects were created in order to power the Pi with current news!<br><br>

At the end of the chatServer.js file are two functions: getNews() function and a getNews_article() function, which both take in as parameters the question_number, and the topic inputed by the user (e.g. business, health, science, etc.); getNews() returns a news article title and getNews_article returns the url for that article.<br><br>

Then in the bot function, questions are numbered 0-19 where question 0 will be asking to input the news category of interest and the rest of the questions will be asking whether the user wants to read the article or check out a different article. Once the user has gone through 20 articles, he/she will have the option to look at more articles from a different topic of choice!

## Record someone trying out your ChatBot

**Using a phone or other video device, record someone trying out your ChatBot. Upload that video to this repository and link to it here!**

[Link to Video!](https://www.youtube.com/watch?v=O9LJBEu66q4&feature=youtu.be)

---
Starter code by [David Goedicke](mailto:da.goedicke@gmail.com), closely based on work by [Nikolas Martelaro](mailto:nmartelaro@gmail.com) and [Captain Anonymous](https://codepen.io/anon/pen/PEVYXz), who forked original work by [Ian Tairea](https://codepen.io/mrtairea/pen/yJapwv).

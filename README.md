#  Tortana
 A web-based application built using Node.js that provides an interactive conversational experience for users.

## :memo: Description
Tortana is a web-based Node.js application that enables users to interact with an AI-powered virtual assistant through speech. 

It utilizes the Whisper API to convert speech to text, generates prompts for the ChatGPT API, and converts responses back to speech. This seamless process delivers natural and accurate conversational experiences. 

Tortana's powerful combination of APIs empowers voice-driven applications and virtual assistants with intelligent, context-aware responses and enhances user engagement.

**Demo Video** : https://www.youtube.com/watch?v=dgw6mdB2jWY&t=8s&ab_channel=KevinMartin

![image](https://github.com/sushantbasak/Tortana/assets/56016930/a5f78be8-7434-4d0e-8860-81c3d29e30f2)

## :bookmark_tabs: Main Features
- Speech-to-Text Conversion: Whisper API accurately transcribes user queries from speech to text.
- ChatGPT Integration: ChatGPT API generates intelligent and context-aware responses based on user prompts.
- Text-to-Speech Synthesis: Text-to-speech technology converts responses back into speech for a seamless user experience.
- Voice-Driven Interaction: Users can communicate with Tortana using their voice, enabling hands-free and intuitive interaction.
- Scalable and Flexible Architecture: Tortana is designed to handle a large number of users and can be easily integrated into existing applications.

## :ballot_box_with_check: Prerequisites
- Node.js (version 14+)
- npm (version 6+)
- OpenAIAPI (version 4+)

## :arrow_down: Local Setup
Clone the Tortana repository, and generate openAI API key and pass it into env file and then follow the below mentioned steps for setting up backend and frontend seprately.


```bash
$ git clone https://github.com/sushantbasak/Tortana
# navigate to the project's directory
$ cd Tortana
# install server dependencies
$ cd server/ && npm install
# start backend
$ npm start
```

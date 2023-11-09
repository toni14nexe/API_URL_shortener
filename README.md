# URL Shortener API

## Description

In this project, I build a URL shortener application using Express.js as the backend framework. The application will allow users to shorten long URLs into shorter, more manageable links. Additionally, it will incorporate JWT (JSON Web Token) authentication for user registration and login purposes, enabling users to shorten URLs and see statistics.

The used database is MongoDB.

# Installation & setup

1. Run installation: `npm run install`
2. Create [Mongo DB cluster](https://account.mongodb.com/account/login?_ga=2.222545755.1989310222.1698915091-760916848.1698395503)
3. Setup env file (in project is included `.env.example` file):

- MONGO_USERNAME = # your Mongo DB username
- MONGO_PASS = # your Mongo DB password
- MONGO_LINK = # your Mongo DB link
- TOKEN_SECRET_KEY = # write your token secret key
- PORT = # API port
- WEB_APP_LINK = # your web/frontend app link
- GMAIL_ACCOUNT = # your gmail email
- GMAIL_APP_PASS = # your Gmail password
- API_LINK = # your API app link (required for testing)
- TEST_USER_USERNAME = # required for testing
- TEST_USER_EMAIL = # required for testing
- TEST_USER_PASSWORD = # required for testing
- TEST_USER_ID = # required for testing
- TEST_USER_EMAIL_HASH = # required for testing - get it on signup response or in verification email
- TEST_USER_RESET_PASSWORD_HASH - # required for testing - get it on reset password email request or in reset password email
- TEST_SHORTENER_ID = # required for testing

4. [Setup Gmail app password for this project](https://www.youtube.com/watch?v=lSURGX0JHbA&ab_channel=MailsDaddySoftware)
5. Run project: `npm run start`

## Run tests

- Run tests: `npm run test`
- Run test with change watcher: `test:watch`

# API documentation

- [Swagger documentation](https://toni14nexe.github.io/API_URL_shortener/)

- `postmanCollection.json` file is included in the project

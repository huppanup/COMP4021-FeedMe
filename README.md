
# Feed Me!

'chat_server.js' and files under 'scripts' come from lab 5/6 to be used for reference. 

## Packages

You need to install the following packages to run this project.

    1. bcrypt
    2. ejs
    3. express-session
    4. fs
    5. socket.io
    5. nodemon
    
(Note: Nodemon is only used to help development, it automatically restarts if the server is changed!)

Install them using the `npm i` command (e.g. `npm i bcrypt`)

## Running the project

Use the following command to start the webpage on [localhost:3000](localhost:3000)

```
  npm start
```
which automatically runs the following script.
```
  ./node_modules/.bin/nodemon eatme_server.js
```
If you don't want to use nodemon, you can use the standard command.
```
  node feedme_server.js
```
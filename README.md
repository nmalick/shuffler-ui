<a name="intro"></a>
## Introduction/Project Purpose

The [React](https://react.dev/) library, is one of the easiest paths to developing web, 
mobile web, native mobile and native desktop applications. It provides a simple application that 
interfaces with a set of REST MVC endpoints.  This project will use Material UI and reactive JavaScript.

## About The Shuffler
The Shuffler is a re-imagined smart shuffle functionality for music players. It groups songs in a given playlist into subsets based on track metadata (i.e: genre, beat, or tempo) as well additional factors (i.e: artist or language). This will allow to identify connections between tracks in order to maintain the "vibe".  Read more about [The Shuffler](https://pensieveproject.com/shuffler)

### Spotify API Client ID and Client Secret
* Go to [Spotify](https://developer.spotify.com/dashboard/applications) and log in with your Spotify account.  Create one if necessary.

* Click on ‘Create an app’ and fill in the ‘App name’ and ‘App description’ of your choice. Mark the checkboxes and create the app.

* Under 'Basic Information' tab You will see your ‘Client Id’ and you can click on ‘Show client secret’ to unhide your ’Client secret’.
![alt text](image.png)

* Click on ‘Edit Settings’ and provide the details such as ‘Website’, ‘Redirect URIs’, and ‘Brand Image’.

* Add Client ID and Client Secret in `config.js`
```shell
export const clientId = "<CLIENT_ID>";
export const clientSecret = "<CLIENT_SECRET>";
```

### NodeJs Installation & Configuration
  * Install [node.js](https://nodejs.org/en/download/) and npm
    * Verify installation `node --version` and `npm --version`

- Navigate to project folder. `cd shuffler-ui`
- Install dependencies. `npm install`


### To start application locally
```shell
 npm start
```

### Home page

```shell
  http://localhost:3000/shuffler
```

### Note
  Application starts at port 3000 as default

  To change the port number which application use set the env variable in terminal,Before starting the application 

  For windows

  ```
    set PORT= port_number eg:4000
  ```
  For Linux/Mac
  ```
    export PORT= port_number eg:4000
  ```
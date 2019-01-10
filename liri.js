require("dotenv").config();
const keys = require('./keys');
const [node, file, liriTask, ...args] = process.argv;



function liri() {
    if (liriTask === 'spotify-this') {
        spotifyThis();
    }
    else if (liriTask === 'movie-this') {
        movieThis();
    }
    else if (liriTask === 'do-what-it-says') {
        doWhatItSays();
    }
    else {
        console.log(`

---------------------
Thank you for using Liri!
Please enter a task followed by a search
I can spotify-this, movie-this or do-what-it-says.
---------------------`);
    };
};

function spotifyThis() {
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);
    let searchQuery = args.join(' ');
    if (!searchQuery) {
        searchQuery = "The Sign Ace of Base";
    }
    spotify.search({
        type: "track",
        query: searchQuery
    },
        function (err, data) {
            if (!err) {
                let songInfo = data.tracks.items;
                for (let i = 0; i < 5; i++) {
                    if (songInfo[i] != undefined) {
                        console.log(`
-----------------

Artist: ${songInfo[i].artists[0].name}

Song: ${songInfo[i].name}

Snippet: ${songInfo[i].preview_url}

Album: ${songInfo[i].album.name}

-----------------`);
                    };
                };
            } else {
                console.log(`Error: ${err}`);
            };
        });
};

function movieThis() {
    const Axios = require('axios');
    let searchTerm = args.join(' ');
    if (!searchTerm) {
        searchTerm = "Mr. Nobody";
    };
    let queryURL = `http://www.omdbapi.com/?t=${searchTerm}&y=&plot=short&apikey=trilogy`;
    Axios.get(queryURL)
        .then((result) => {
            const { Title, Year, imdbRating, Country, Language, Plot, Actors } = result.data;
            const rottenTomatoes = result.data.Ratings[1].Value;
            console.log(`
-------------------

Movie Title: ${Title}

Year of Release: ${Year}

IMDB Rating: ${imdbRating}

Rotten Tomatoes Rating: ${rottenTomatoes}

Country of Origin: ${Country}

Language: ${Language}

Actors: ${Actors}

Plot: ${Plot}

-------------------`);
        }).catch((err) => {
            console.log(err);
        })
};

function doWhatItSays() {
    const fs = require('fs');
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            let textLine = data.split(",");

            let task = textLine[0];
            let query = textLine[1];
            console.log(`${task} ${query}`);
            if (task === "spotify-this") {
                spotifyThis(query);
            } else {
                movieThis(query);
            }
        };
    });
};

liri();
const express = require('express')
// will use this later to send requests
const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.status(200).send('Server is working.')
})

app.listen(port, () => {
	console.log(`🌏 Server is running at http://localhost:${port}`)
})

app.post('/getmovie', (req, res) => {
	const movieToSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie
			? req.body.result.parameters.movie
			: ''

	const reqUrl = encodeURI(`https://api.icndb.com/jokes/random/`)
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
                const joke = JSON.parse(completeResponse)
				const movie = JSON.parse(completeResponse)
                console.log(joke);
				let dataToSend = movieToSearch
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'getmovie'
			})
		}
    )
    // function chuckJoke(){
    //     axios.get('https://api.icndb.com/jokes/random/')
    //     .then(res => {
    //         const joke = res.data.value.joke;
    //         const params = {
    //             icon_emoji: ':laughing:'
    //         };
    //         bot.postMessageToChannel('general',
    //         `Chuck Norris: ${joke}`,
    //         params);
    //     })
    // }
})
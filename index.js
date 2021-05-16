const express = require('express')
// will use this later to send requests
const http = require('http')
// import env variables
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

function chuckJoke(){
    axios.get('https://api.icndb.com/jokes/random/')
    .then(res => {
        return res.data.value.joke;
        
    })
}

app.get('/', (req, res) => {
    // res.status(200).send(`SERVER IS WORKING!`)
    res.send(chuckJoke())
    
})



app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})

app.post('https://api.icndb.com/jokes/random/', (req, res) => {
	

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
				// const movie = JSON.parse(completeResponse)
                console.log(joke);
				let dataToSend = joke;
				// dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
				// 	movie.Director
				// } and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                // }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'icndb'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'icndb'
			})
		}
    )
    
})
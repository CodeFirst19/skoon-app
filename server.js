const express = require('express');
const dotenv = require('dotenv');

// Points to configuration file
dotenv.config({ path: './config.env' });

// assign the result of calling express...will add a bunch of methods to to the app variable
const app = express();

//Serving static files
app.use(express.static('./dist/skoon-app'));

app.get('/*', (req, res) => res.sendFile('index.html', { root: 'dist/skoon-app/' }));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started -- Angular running on port: ${port}`);
});

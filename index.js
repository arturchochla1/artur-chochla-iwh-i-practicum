require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_TOKEN;
const CUSTOM_OBJECT_WITH_PROPERTIES = '2-145944425?properties=name&properties=size&properties=colour';
const CUSTOM_OBJECT_API = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_WITH_PROPERTIES}`;


console.log('HubSpot Token:', PRIVATE_APP_ACCESS);

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(CUSTOM_OBJECT_API, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        console.log(response.data.results);
        res.render('homepage', {
            title: 'Homepage | Integrating With HubSpot I Practicum',
            records: response.data.results
        });
    } catch (error) {
        console.error(error.response?.status, error.response?.data || error.message);
        res.status(500).send(error);
    }
});


// * Localhost
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
});
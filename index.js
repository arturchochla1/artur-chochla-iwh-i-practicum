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

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(CUSTOM_OBJECT_API, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        //console.log(response.data.results);
        res.render('homepage', {
            title: 'Homepage | Integrating With HubSpot I Practicum',
            records: response.data.results
        });
    } catch (error) {
        //console.error(error.response?.status, error.response?.data || error.message);
        res.status(500).send(error);
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/create-cobj', async (req, res) => {
    const { name, size, colour } = req.body;
    try {
        await axios.post('https://api.hubapi.com/crm/v3/objects/2-145944425', {
            properties: { name, size, colour }
        }, {
            headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }
        });
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error creating custom object');
    }
});


// * Localhost
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
});
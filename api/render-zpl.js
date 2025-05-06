// api/render-zpl.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const zpl = req.body.zpl;
    const response = await axios.post(
      'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
      zpl,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/pdf',
        },
        responseType: 'arraybuffer',
      }
    );
    res.set('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao converter ZPL');
  }
});

module.exports = app;

// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/render-zpl', async (req, res) => {
  try {
    const zpl = req.body.zpl;
    const response = await axios.post(
      'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
      zpl,
      {
        headers: {
          'Content-Type': 'application/zpl',
          'Accept': 'application/pdf' // ou image/png
        },
        responseType: 'arraybuffer'
      }
    );
    res.set('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Erro ao converter ZPL');
  }
});

app.listen(3000, () => console.log('Proxy rodando na porta 3000'));

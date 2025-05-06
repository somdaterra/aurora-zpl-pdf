const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Libera todas as origens
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>API ZPL to PDF</h1>
    <p>Use o endpoint <code>POST /render-zpl</code> com um corpo contendo <code>{ zpl: "..." }</code> para converter ZPL em PDF.</p>
  `);
});

app.post('/render-zpl', async (req, res) => {
  try {
    const zpl = req.body.zpl;
    console.log("zpl: ", zpl);
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
    console.error("Erro:", error);
    res.status(500).send('Erro ao converter ZPL');
  }
});

app.listen(3000, () => console.log('Proxy rodando na porta 3000'));

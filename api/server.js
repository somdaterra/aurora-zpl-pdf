const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Lista de origens permitidas
const allowedOrigins = [
  	'http://127.0.0.1:3000',
	'https://aurora-zpl-pdf.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (como de ferramentas locais ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Não permitido pelo CORS'));
    }
  }
}));

app.use(express.json());

app.post('/render-zpl', async (req, res) => {
  try {
    const zpl = req.body.zpl;
    const response = await axios.post(
      'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
      zpl,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/pdf'
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

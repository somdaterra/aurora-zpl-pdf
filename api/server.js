const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Função para verificar se a origem pertence ao domínio vercel.app
const allowedOrigins = [
  /^https:\/\/aurora-zpl-pdf(?:-[\w-]+)?\.vercel\.app$/,
  /^http:\/\/127\.0\.0\.1:5500$/,
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (como de ferramentas locais ou curl)
    if (!origin) return callback(null, true);

    // Verifica se a origem está na lista de origens permitidas
    const isOriginAllowed = allowedOrigins.some(pattern => pattern.test(origin));

    if (isOriginAllowed) {
      return callback(null, true);
    } else {
      return callback(new Error('Não permitido pelo CORS'));
    }
  }
}));

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
    console.log("error: ", error)
    res.status(500).send('Erro ao converter ZPL');
  }
});

app.listen(3000, () => console.log('Proxy rodando na porta 3000'));

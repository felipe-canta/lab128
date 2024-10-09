require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware para interpretar JSON e dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));

// Rota para servir o formulário HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'forms.html'));
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Rota para lidar com o envio do formulário
app.post('/enviar-email', (req, res) => {
    console.log(req.body); // Verifique os dados recebidos
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    transporter.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Nova mensagem do formulário de contato',
        text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`,
    })
    .then(() => {
        console.log('E-mail enviado com sucesso!');
        res.redirect('/'); // Redireciona de volta para o formulário
    })
    .catch(error => {
        console.error('Erro ao enviar e-mail:', error.message);
        res.status(500).json({ message: 'Erro ao enviar o e-mail.' });
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const port = 8081;
const path = require("path");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "home.html"));
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "Login.html"));
})
app.get('/PaginaInicial', (req, res) => {
    res.sendFile(path.join(__dirname, "PaginaInicial.html"));
})
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, "Perfil.html"));
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
    database: 'curso_sucelso'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados.');
});

app.post('/submit', (req, res) => {
    const { user, password } = req.body;
    const query = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
    
    connection.query(query, [user, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
        }
        res.json({ message: 'Cadastro realizado com sucesso!' });
    });
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';
    
    connection.query(query, [user, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
        }
        if (results.length > 0) {
            res.json({ message: 'Login realizado com sucesso!' });
        } else {
            res.status(401).json({ message: 'Usuário ou senha incorretos.' });
        }
    });
});

app.listen(8081, () => {
    console.log('Servidor rodando na porta ' + port + '.');
});

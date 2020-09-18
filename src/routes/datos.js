const express = require('express');
const router = express.Router();
var mysql = require('mysql')
var io = require('socket.io').listen(8000)

const mysqlConnection = require('../database')

mysqlConnection.connect(function(err) {
    if (err) console.log(err)
})




router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM registros', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

router.get('/ultimos', (req, res) => {
    mysqlConnection.query('SELECT * FROM registros ORDER BY registros.fechaHora DESC LIMIT 10;', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});


router.get('/fechas/:fecha1/:fecha2', (req, res) => {
    //req.params.id;
    const { fecha1, fecha2 } = req.params;
    mysqlConnection.query('SELECT * FROM registros WHERE registros.fechaHora  BETWEEN ? AND ?;', [fecha1, fecha2], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

router.get('/fechas/maximo/:fecha1/:fecha2', (req, res) => {
    //req.params.id;
    const { fecha1, fecha2 } = req.params;
    mysqlConnection.query('SELECT MAX(registros.valor) FROM registros WHERE registros.fechaHora  BETWEEN ? AND ?;', [fecha1, fecha2], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

router.get('/fechas/minimo/:fecha1/:fecha2', (req, res) => {
    //req.params.id;
    const { fecha1, fecha2 } = req.params;
    mysqlConnection.query('SELECT MIN(registros.valor) FROM registros WHERE registros.fechaHora  BETWEEN ? AND ?;', [fecha1, fecha2], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

router.get('/fechas/promedio/:fecha1/:fecha2', (req, res) => {
    //req.params.id;
    const { fecha1, fecha2 } = req.params;
    mysqlConnection.query('SELECT AVG(registros.valor) FROM registros WHERE registros.fechaHora  BETWEEN ? AND ?;', [fecha1, fecha2], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});

router.get('/:fecha/:hora1/:hora2', (req, res) => {
    //req.params.id;
    const { fecha, hora1, hora2 } = req.params;
    mysqlConnection.query('SELECT * FROM registros WHERE registros.fechaHora  BETWEEN ? AND ?;', [fecha + " " + hora1, fecha + " " + hora2], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    })
});


router.post('/', (req, res) => {
    const { valor, fechaHora } = req.body;
    mysqlConnection.query("INSERT INTO `SistemaRiego`.`registros` (`valor`, `fechaHora`) VALUES (?,?);", [valor, fechaHora], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Dato agregado exitosamente.' });
        } else {
            console.log(err);
        }
    })
});


module.exports = router;
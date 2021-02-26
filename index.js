const express = require('express');
const path = require('path');
const todoRoutes = require('./ModelViev/todo');
const app = express();
app.use(express.static('upload'));
let cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'upload')));
app.use('/api', todoRoutes);


// app.use((req, res, next) => {
//   res.sendFile('./public/index.html')
// })

app.listen(PORT);
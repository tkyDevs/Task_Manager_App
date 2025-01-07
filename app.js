// ------------------------------------- Mongoose Connection
const mongoose = require('mongoose');
const {Task, addTask, getTasks, findTask, updateTask, deleteTask} = require('./models/task');

async function connectMongo() {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskManager');
    console.log('Connected to MongoDB...');
}
connectMongo().catch(err => console.log(err));

// ------------------------------------- Server Setup
const express = require('express');
const app = express();
app.use(express.static('./public'));
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'));
})

app.get('/addTask', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/addTask.html'));
})
app.get('/addTask', (req, res) => {
    res.send('testing');
})

app.get('*', (req, res) => {
    res.status(404).send('Ops! Looks like you found my invisible border...');
})

app.listen(3000, () => {
    console.log('Server listening on port 3000...');
})
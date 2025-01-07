const mongoose = require('mongoose');
const {Task, addTask, getTasks, findTask, updateTask, deleteTask} = require('./models/task');

async function connectMongo() {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskManager');
    console.log('Connected to MongoDB...');
}
connectMongo().catch(err => console.log(err));


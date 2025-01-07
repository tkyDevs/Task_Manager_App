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
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const path = require('path');

async function fetchTasks(req, res, next) {
    try {
      // Fetch tasks from the database
      const tasks = await Task.find();  // This will be an array of task
      req.tasks = tasks;  // Attach tasks to the request object
      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Error fetching tasks');
    }
  }

// --------- HOMEPAGE
app.get('/', fetchTasks, (req, res) => {
    const taskList = req.tasks.map(item => ({
        title: item.title,
        description: item.description
    }))
    res.render('pages/index', {
        taskList: taskList
    });
});

app.use(express.static('./views/pages'));

// --------- ADD TASK
app.get('/addTask', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/pages/addTask.html'));
})
app.post('/addTask', (req, res) => {
    const { title, description } = req.body;
    addTask(title, description);
    res.redirect('/');  // Redirect back to the homepage after submission
});

// --------- DELETE TASK
app.post('/deleteTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    console.log(taskId);
    deleteTask(taskId);
    res.redirect('/');
})

app.get('*', (req, res) => {
    res.status(404).send('Ops! Looks like you found my invisible border...');
})

app.listen(3000, () => {
    console.log('Server listening on port 3000...');
})
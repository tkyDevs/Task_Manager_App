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
      next();
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



// --------- ADD TASK
app.get('/addTask', (req, res) => {
    res.sendFile(path.resolve(__dirname, './public/addTask.html'));
})
app.post('/addTask', (req, res) => {
    const { title, description } = req.body;
    addTask(title, description);
    res.redirect('/');
});

// --------- DELETE TASK
app.post('/deleteTask/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    deleteTask(taskId);
    res.redirect('/');
})

// --------- VIEW TASK
app.get('/viewTask/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const taskObj = await Task.findOne({title: taskId});
    res.render('pages/viewTask', { task: taskObj });
})
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.status(404).send('Ops! Looks like you found my invisible border...');
})

app.listen(3000, () => {
    console.log('Server listening on port 3000...');
})
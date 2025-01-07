const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean, default: false
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

async function addTask(title, description) {
    const newTask = new Task({title, description});
    await newTask.save();
    console.log("Task added:", newTask);
}

async function getTasks() {
    const tasks = await Task.find();
    console.log("All tasks:", tasks);
}

async function findTask(title) {
    const task = await Task.findOne({title: title}).exec();
    if (task) {
        console.log(task.id);
        return task.id;
    } else {
        return null;
    }
}

async function updateTask(title, updates) {
    const id = await findTask(title);
    if (id) {
        const task = await Task.findByIdAndUpdate(id, updates, { new: true });
        console.log("Updated task:", task);
    } else {
        console.log(`Task with the title "${title}" not found!`);
    }
  }
  
  // Delete a task
async function deleteTask(title) {
    const id = await findTask(title);
    if (id) {
        await Task.findByIdAndDelete(id);
        console.log(`Task with ID ${id} deleted`);
    } else {
        console.log(`Task with the title "${title}" not found!`);
    }
}

module.exports = {Task, addTask, getTasks, findTask, updateTask, deleteTask};
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
    completed: {
        type: Boolean, default: false
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);

async function addTask(title, description) {
    const newTask = new Task({title, description});
    await newTask.save();
    console.log("Task added");
}

async function getTasks() {
    const tasks = await Task.find();
    return tasks;
}

async function findTask(title) {
    const task = await Task.findOne({title: title}).exec();
    if (task) {
        return task.id;
    } else {
        return null;
    }
}

async function updateTask(title, updates) {
    console.log(title);
    const id = await Task.findOne({title: title});
    if (id) {
        const task = await Task.findByIdAndUpdate(id, updates, { new: true });
        console.log("Updated task", task);
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
import { useState, useEffect } from 'react'
import TaskComponent from '../components/TaskComponent.jsx'
import axios from 'axios'
import { Button, Card, Input, Checkbox } from 'antd'

function App() {
  const [tasks, updateTasks] = useState([])
  const [addTaskVisibility, setAddtaskVisibility] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', body: '', is_done: false });
  const [taskToEdit, setTaskToEdit] = useState({ title: '', body: '', is_done: false, id: 0 })
  const [editTaskVisibility, setEditTaskVisibility] = useState(false);

  const fetchTasks = () => {
    axios.get(`http://127.0.0.1:8000/tasks`,).then(resp => {
      updateTasks(resp.data)
    })
  }

  const editTask = (task) => {
    axios.put(`http://127.0.0.1:8000/tasks/${task.id}`,
    {
      "title": task.title,
      "body": task.body,
      "is_done": task.is_done
    }).then(resp => {
      setEditTaskVisibility(false)
      fetchTasks()
    })
  }

  const addTask = () => {
    axios.post(`http://127.0.0.1:8000/tasks`,
      {
        title: newTask.title,
        body: newTask.body,
        is_done: newTask.is_done
      }).then(resp => {
        setNewTask({ title: '', body: '' });
        setAddtaskVisibility(false);
        fetchTasks();
      })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <>
      <div className="flex justify-center text-6xl" style={{ fontSize: "3rem" }}>
        ToDo List
      </div>
      <div className='flex justify-center'>
        <div style={{ width: 600 }} className='flex justify-end'>
          <Button
            type="primary"
            size="small"
            onClick={() => setAddtaskVisibility(!addTaskVisibility)}
          >
            {addTaskVisibility ? "Отмена" : "+"}
          </Button>
        </div>
      </div>
      {addTaskVisibility && (
        <div className="flex justify-center" style={{ marginTop: "20px" }}>
          <Card title="Добавить задачу" style={{ width: 600 }}>
            <Input
              placeholder="Название задачи"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <Input.TextArea
              placeholder="Описание задачи"
              value={newTask.body}
              onChange={(e) => setNewTask({ ...newTask, body: e.target.value })}
              rows={3}
              style={{ marginBottom: "10px" }}
            />
            <Checkbox
              checked={newTask.is_done}
              onChange={(e) => setNewTask({ ...newTask, is_done: e.target.checked })}
            >
              Выполнена
            </Checkbox>
            <br />
            <br />
            <Button type="primary" onClick={addTask}>
              Добавить
            </Button>
          </Card>
        </div>
      )}
      {editTaskVisibility && (
        <div className="flex justify-center" style={{ marginTop: "20px" }}>
          <Card title="Изменить задачу" style={{ width: 600 }}>
            <Input
              placeholder="Название задачи"
              value={taskToEdit.title}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <Input.TextArea
              placeholder="Описание задачи"
              value={taskToEdit.body}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, body: e.target.value })}
              rows={3}
              style={{ marginBottom: "10px" }}
            />
            <Checkbox
              checked={taskToEdit.is_done}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, is_done: e.target.checked })}
            >
              Выполнена
            </Checkbox>
            <br />
            <br />
            <Button type="primary" onClick={() => {editTask(taskToEdit)
              console.log(newTask)
            }}>
              Изменить
            </Button>
          </Card>
        </div>
      )}
      <div className='flex justify-center' style={{ marginTop: "20px" }}>
        <TaskComponent tasks={tasks} onTaskUpdate={fetchTasks} onTaskEdit={setEditTaskVisibility} setNewTask={setTaskToEdit}/>
      </div>
    </>

  )
}

export default App

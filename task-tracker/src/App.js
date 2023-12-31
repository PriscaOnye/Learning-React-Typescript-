import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import About from "./components/About"
import NewFooter from "./components/NewFooter"


const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  //useEffect 
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks')
    const data = await response.json()

    // console.log(data)
    return data
  }

  // Fetch Task
  const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await response.json()

    // console.log(data)
    return data
  }

  // Add Task
  const addTask = async (task) => {
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // console.log(id);
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    // console.log('delete', id);
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = {...taskToToggle,
    reminder: !taskToToggle.reminder}

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await response.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ? {...task, reminder: data.reminder} : task
      )
    )
  }


  return (
    <Router>
      <div className="container">
        <Header 
          onAdd={() => setShowAddTask (!showAddTask)} 
          showAdd={showAddTask}
        />
        
      <Routes>
        <Route path='/' element={(props) => (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
                ) : ( 'No Tasks To Show' )
              }
            </>
          )}
        />
        
        <Route path="/about" element={<About />} />
      </Routes>


        <NewFooter />
      </div>
    </Router>
  )
}


export default App;

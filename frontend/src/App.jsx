
import { useEffect, useState, useRef } from 'react'
import './App.css'

const API = 'http://localhost:8081'

function App() {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  const notificationTimer = useRef(null)

  // Show notification at the top and hide it after 2.5 seconds
  const notify = (text) => {
    setMessage(text)
    setShowNotification(true)

    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current)
    }

    notificationTimer.current = setTimeout(() => {
      setShowNotification(false)
    }, 2500)
  }

  // Load all users
  const loadUsers = async () => {
    try {
      const response = await fetch(`${API}/all`)

      if (!response.ok) {
        throw new Error('Unable to load users')
      }

      setUsers(await response.json())
    } catch (error) {
      notify(`Error: ${error.message}`)
    }
  }

  useEffect(() => {
    loadUsers()

    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current)
      }
    }
  }, [])

  // Clear form fields
  const clearForm = () => {
    setId('')
    setName('')
    setEmail('')
    setPassword('')
  }

  // Add user
  const addUser = async () => {
    if (!id || !name.trim() || !email.trim() || !password) {
      notify('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch(`${API}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(id),
          username: name.trim(),
          email: email.trim(),
          password,
          mobile: '',
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      notify('User added successfully!')
      clearForm()
      await loadUsers()
    } catch (error) {
      notify(`Add failed: ${error.message}`)
    }
  }

  // Update user
  const updateUser = async () => {
    if (!id) {
      notify('Enter the user ID to update.')
      return
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name || null,
          email: email || null,
          password: password || null,
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      notify('User updated successfully!')
      await loadUsers()
    } catch (error) {
      notify(`Update failed: ${error.message}`)
    }
  }

  // Delete user
  const deleteUser = async () => {
    if (!id) {
      notify('Enter the user ID to delete.')
      return
    }

    if (!window.confirm(`Delete user ${id}?`)) {
      return
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      notify('User deleted successfully!')
      clearForm()
      await loadUsers()
    } catch (error) {
      notify(`Delete failed: ${error.message}`)
    }
  }

  return (
    <main className="app">
      <h1>User Management</h1>

      {/* Top notification */}
      {showNotification && (
        <div
          className={`notification ${
            message.toLowerCase().includes('failed') ||
            message.toLowerCase().includes('error') ||
            message.toLowerCase().includes('unable')
              ? 'error'
              : 'success'
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      {/* User form */}
      <div className="user-form">
        <input
          type="number"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="buttons">
          <button type="button" onClick={addUser}>
            Add
          </button>

          <button type="button" onClick={updateUser}>
            Update
          </button>

          <button type="button" onClick={deleteUser}>
            Delete
          </button>
        </div>
      </div>

      {/* All users */}
      <h2>All Users</h2>

      <ul className="users-list">
        {users.length === 0 ? (
          <li>No users found</li>
        ) : (
          users.map((user) => (
            <li key={user.id}>
              {user.id} - {user.username} - {user.email}
            </li>
          ))
        )}
      </ul>
    </main>
  )
}

export default App

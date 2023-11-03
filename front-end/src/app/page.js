"use client"
import React, { useEffect, useState } from 'react';
import style from "./style.css"

function App() {
  const BE_URL = 'http://localhost:8080';

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updateName, setUpdateName] = useState('');
  const [updateAge, setUpdateAge] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    const response = await fetch(`${BE_URL}/user`);
    const data = await response.json();
    setUsers(data.data);
  }    

  async function handleSubmit(e) {
    e.preventDefault();
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name,
        age: age,
        password: password,
      }),
    };

    const response = await fetch(`${BE_URL}/search`, options);
    const data = await response.json();
    if (data.status === 'success') {
      setUsers(data.data);
      setName('');
      setAge('');
      setPassword('');
    } else {
      console.error('Error adding user:', data.status);
    }
  }

  async function handleDelete(id) {
    const options = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    };

    const response = await fetch(`${BE_URL}/search`, options);
    const data = await response.json();
    if (data.status === 'success') {
      setUsers(data.data);
    } else {
      console.error('Error deleting user:', data.status);
    }
  }

  async function handleUpdate(id) {
    setSelectedUserId(id);
    const userToUpdate = users.find(user => user.id === id);
    setUpdateName(userToUpdate.username);
    setUpdateAge(userToUpdate.age);
  }

  async function submitUpdate(e) {
    e.preventDefault();
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedUserId,
        username: updateName,
        age: updateAge,
      }),
    };

    const response = await fetch(`${BE_URL}/search`, options);
    const data = await response.json();
    if (data.status === 'success') {
      setUsers(data.data);
      setSelectedUserId(null);
      setUpdateName('');
      setUpdateAge('');
    } else {
      console.error('Error updating user:', data.status);
    }
  }

  function handleLogout() {
    setLoggedInUser(null);
  }
  async function handleLogin(username, password) {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
  
    const response = await fetch(`${BE_URL}/login`, options);
    const data = await response.json();
  
    if (data.status === 'success') {
      setLoggedInUser(data.user);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  }
  
  
  return (
    <div className='container'>
      <h1>User CRUD with FS Module</h1>

      {loggedInUser ? (
        <div>
          <h2>Welcome, {loggedInUser.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <p>Age: {loggedInUser.age}</p>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                name:
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                age:
                <input
                  name="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                password:
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>

          <h1>user list</h1>
          {users &&
            users.map((user) => (
              <div key={user.id}>
                {user.username} {user.age}
                <button
                  style={{ width: '100px', height: '20px' }}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  style={{ width: '100px', height: '20px' }}
                  onClick={() => handleUpdate(user.id)}
                >
                  Update
                </button>
                {selectedUserId === user.id && (
                  <form onSubmit={submitUpdate}>
                    <label>
                      name:
                      <input
                        name="updateName"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                      />
                    </label>
                    <label>
                      age:
                      <input
                        name="updateAge"
                        value={updateAge}
                        onChange={(e) => setUpdateAge(e.target.value)}
                      />
                    </label>
                    <button type="submit">Save</button>
                  </form>
                )}
                <div>
                  password:
                  <input
                    type="password"
                    name="loginPassword"
                    // value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                <button
  style={{ width: '100px', height: '20px' }}
  onClick={() => handleLogin(user.username, loginPassword)}
>
  Login
</button>
              
                </div>

              </div>
             
            ))}
        </div>
      )}
    </div>
  );
}

export default App;

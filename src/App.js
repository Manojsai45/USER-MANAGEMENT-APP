import './App.css';
import React, { useEffect, useState } from 'react';
import UserList from './UserList';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // To track the user being edited

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleEdit = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setEditingUser(userToEdit); // Set the user to be edited
  };

  const handleUpdate = async (updatedUser) => {
    // Simulate a PUT request to update the user
    await fetch(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    // Update the users state with the edited user
    const updatedUsers = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    setUsers(updatedUsers);
    setEditingUser(null); // Close the editing form
  };

  const handleDelete = async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE',
    });
    const filteredUsers = users.filter(user => user.id !== id);
    setUsers(filteredUsers);
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      {editingUser && (
        <EditUserModal user={editingUser} onUpdate={handleUpdate} onClose={() => setEditingUser(null)} />
      )}
    </div>
  );
};

// Add the EditUserModal component here
const EditUserModal = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="modal">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Update User</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default App;

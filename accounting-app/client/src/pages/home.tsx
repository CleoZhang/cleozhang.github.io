import React from 'react'
import axios from "axios";

type User = {
    username: string;
    password: string;
    isAdmin: boolean;
  }
  
  function Home() {
    const [users, setUsers] = React.useState<User[]>([]);
  
    React.useEffect(() => {
      axios.get("http://localhost:3001/users").then((response) => {
        setUsers(response.data);
      })
    }, [])
  
    return (
      <ul>
          {users.map(user => <li key={user.username}>{user.username}</li>)}
      </ul>
    );
  }

export default Home

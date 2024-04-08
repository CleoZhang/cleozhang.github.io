import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type User = {
  username: string;
  password: string;
  isAdmin: boolean;
};

function Home() {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  return (
    <>
      <ul>
        <li>
          <Link to="/projects">项目</Link>
        </li>
        <li>
          <Link to="/recategories">收支分类</Link>
        </li>
        <li>
          <Link to="/generalaccounts">总分类账户</Link>
        </li>
      </ul>

      <ul>
        {users.map((user) => (
          <li key={user.username}>{user.username}</li>
        ))}
      </ul>
    </>
  );
}

export default Home;

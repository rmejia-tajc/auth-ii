import React from "react";
import axios from "axios";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    department: "",
  };

  render() {
    return (
      <>
        <h2>Register</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username" />
            <input
              name="username"
              id="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              type="text"
              placeholder="username"
            />
          </div>
          <div>
            <label htmlFor="password" />
            <input
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              type="password"
              placeholder="password"
            />
          </div>
          <div>
            <label htmlFor="department" />
            <input
              name="department"
              id="department"
              value={this.state.department}
              onChange={this.handleInputChange}
              type="text"
              placeholder="department"
            />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </>
    );
  }

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    axios
      .post("/register" , this.state)
      .then(res => {
        localStorage.setItem("jwt", res.data.token);

        this.props.history.push("/login");
      })
      .catch(error => console.error(error));
  };
}

export default Login;

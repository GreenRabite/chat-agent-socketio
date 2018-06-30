import React, { Component } from 'react';
import Dashboard from '../agent/dashboard';
import ClientDashboard from '../client/client_dashboard';
import io from "socket.io-client";
import './login.css';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      role: "",
      username: ""
    };
    this.userSelect = this.userSelect.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.socket = io('localhost:3000');
    this.socket.on("Receive User Count", (data)=>{
      console.log(data);
      this.setState({
        agent: data.agent,
        client: data.client
      });
    });
    this.socket.on('disconnect', (data) => {
      console.log(`${data} has been disconnected`);
    });
  }

  userSelect(field){
    if (field === 'agent') {
      this.socket.emit('User Chosen', {
        role: 'agent',
        agent: this.state.agent + 1,
        client: this.state.client,
        socketId: this.socket.id
      });
      this.setState({
        role: 'agent',
        agent: this.state.agent + 1
      });
    }else if (field === 'client-pre') {
      this.setState({
        role: 'client-pre',
      });
    }
  }

  handleUpdate(field){
    return (e) => {
      console.log(field);
      this.setState({
        [field]: e.target.value
      });
    };
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({
      role: 'client',
      client: this.state.client + 1
    });
    this.socket.emit('User Chosen', {
      role: 'client',
      socketId: this.socket.id,
      agent: this.state.agent,
      client: this.state.client +1,
      username: this.state.username
    });
  }

  render() {
    const agentImg = this.state.agent === 0 ?
      <div>
        <img onClick={(e)=>this.userSelect("agent")} src="https://cdn1.iconfinder.com/data/icons/e-commerce-64/683/ECOMMERCE_Icons_Service-512.png"/>
        <h4>AGENT</h4>
      </div> :
      <div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/ProhibitionSign2.svg/1200px-ProhibitionSign2.svg.png"/>
        <h4>AGENT OCCUPIED</h4>
      </div>;
    const clientInfo =
        <form>
          <input type="text"
                 onChange={this.handleUpdate('username')}
                 value={this.state.username}
                 placeholder="NAME"/>
          <button onClick={this.handleSubmit}>Submit</button>
        </form>;

    if (this.state.role === '' || this.state.role === 'client-pre') {
      return(
        <section id="login-screen-container">
          <h3>Are you an agent or a customer?</h3>
          <div className="avatars">
            {agentImg}
            <div>
              <img onClick={(e)=>this.userSelect("client-pre")} src="http://www.edubizsoft.com/images/icons/users_with_circle_256.png"/>
              <h4>CLIENT</h4>
            </div>
          </div>
          <div id="client-info">
            {this.state.role === 'client-pre' ? clientInfo : ""}
          </div>
        </section>
      );
    }else if (this.state.role === 'agent') {
      console.log("Going to dashboard");
      return (
        <Dashboard socket={this.socket}/>
      );
    }else if (this.state.role === 'client') {
      return(
        <ClientDashboard socket={this.socket} username={this.state.username} />
      );
    }
  }
}

export default Login;

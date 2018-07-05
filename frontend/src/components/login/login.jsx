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
      username: "",
      colors: ['#3D9CC4', '#24659A', '#98C3E7', '#D5E6F4',
               '#CB6080', '#A33B5A', '#E098AE', '#F7E2E8',
               '#966AB8', '#6E3A96', '#B188D1', '#EAE0F2',
               '#0AA693', '#06786A', '#55C4B6', '#B7EAE3']
    };
    this.userSelect = this.userSelect.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.socket = io('localhost:3001');
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
    const color = this.state.colors[Math.floor(Math.random()*this.state.colors.length)];
    const agentImg = this.state.agent === 0 ?
      <div>
        <img onClick={(e)=>this.userSelect("agent")} src="/images/agent.png"  alt=''/>
        <h4>AGENT</h4>
      </div> :
      <div>
        <img src="/images/no-agent.png"  alt=''/>
        <h4>AGENT OCCUPIED</h4>
      </div>;
    const clientInfo =
        <form onSubmit={this.handleSubmit}>
          <input type="text"
                 onChange={this.handleUpdate('username')}
                 value={this.state.username}
                 placeholder="NAME"
                 required/>
          <button>Submit</button>
        </form>;

    if (this.state.role === '' || this.state.role === 'client-pre') {
      return(
        <section id="login-screen-container">
          <h3>Are you an agent or a customer?</h3>
          <div className="avatars">
            {agentImg}
            <div>
              <img onClick={(e)=>this.userSelect("client-pre")} src="/images/clients.png" alt=''/>
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
        <ClientDashboard socket={this.socket}
                         username={this.state.username}
                         color={color}/>
      );
    }
  }
}

export default Login;

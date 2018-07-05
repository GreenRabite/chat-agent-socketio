import React from 'react';
import ClientChatroom from './client_chatroom';
import NavFooter from './nav_footer';
import AgentConsole from './agent_console/agent_console';
import './dashboard.css';

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    this.state = {
           message: '',
           messages: [],
           clients: {},
           colors: ['#3D9CC4', '#24659A', '#98C3E7',
                    '#CB6080', '#A33B5A', '#E098AE',
                    '#966AB8', '#6E3A96', '#B188D1',
                    '#0AA693', '#06786A', '#55C4B6']
         };
  }

  componentDidMount(){
    this.socket.emit('JoinClients',{});
    this.socket.on('ReceiveClients', data =>{
      console.table(data);
      this.setState({
        clients: data
      });
    });
   this.socket.on('NewClients',()=>{
     this.socket.emit('JoinClients',{});
   });
  }

  render(){
    const chatrooms = [];
    const clients = this.state.clients;
    for(const roomId in clients){
      if (Object.prototype.hasOwnProperty.call(clients,roomId)) {
        chatrooms.push(
          <ClientChatroom socket={this.socket}
                          roomId={roomId}
                          username={this.state.clients[roomId]}
                          color={this.state.colors[Math.floor(
                                  Math.random()*this.state.colors.length)]}
                          key={roomId}/>
        );
      }
    }
    return(
      <div id="dashboard">
        <AgentConsole />
        {chatrooms}
        <NavFooter socket={this.socket}
                   clients={this.state.clients}/>
      </div>
    );
  }
}

export default Dashboard;

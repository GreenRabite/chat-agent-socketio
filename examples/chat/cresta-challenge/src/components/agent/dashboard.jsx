import React from 'react';
import ConversationContainer from '../conversation/conversation_container';
import ClientChatroom from './client_chatroom';
import NavFooter from './nav_footer';
import './dashboard.css';

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    console.log(this.socket.id);
    console.log("------");
    this.handleUpdate=this.handleUpdate.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.addMessage=this.addMessage.bind(this);
    this.state = {
           message: '',
           messages: [],
           clients: {},
           colors: ['#3D9CC4', '#24659A', '#98C3E7', '#D5E6F4',
                    '#CB6080', '#A33B5A', '#E098AE', '#F7E2E8',
                    '#966AB8', '#6E3A96', '#B188D1', '#EAE0F2',
                    '#0AA693', '#06786A', '#55C4B6', '#B7EAE3']
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

  addMessage(data){
    console.log(data);
    this.setState({messages: [...this.state.messages, data.message]});
    console.log(this.state.messages);
  }

  handleUpdate(field){
    return (e) => {
      this.setState({
        [field] : e.target.value
      });
    };
  }

  handleSubmit(e){
    e.preventDefault();
    this.socket.emit('SEND_MESSAGE', {
                message: this.state.message,
                room: Object.keys(this.state.clients)[0],
                sender: 'agent'
            });
            this.setState({message: ''});
  }

  render(){
    let messages = this.state.messages.map(message=>{
      return <li>{`${message}`}</li>;
      });
    const color = this.state.colors[Math.floor(Math.random()*this.state.colors.length)];
    const chatrooms = [];
    const clients = this.state.clients;
    for(const roomId in clients){
      if (Object.prototype.hasOwnProperty.call(clients,roomId)) {
        chatrooms.push(
          <ClientChatroom socket={this.socket}
                          roomId={roomId}
                          username={this.state.clients[roomId]}
                          color={this.state.colors[Math.floor(
                                  Math.random()*this.state.colors.length)]}/>
        );
      }
    }
    return(
      <div id="dashboard">
        {chatrooms}
        <NavFooter socket={this.socket}
                    clients={this.state.clients}/>
      </div>
    );
  }
}

export default Dashboard;

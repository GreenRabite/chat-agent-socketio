import React from 'react';
import CustomerChatBody from './customer_chat_body/customer_chat_body';
import './client-dashboard.css';

class ClientDashboard extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    this.handleUpdate=this.handleUpdate.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.addMessage=this.addMessage.bind(this);
    this.handleKeyPress=this.handleKeyPress.bind(this);
    this.state = {
           username: this.props.username,
           message: '',
           messages: []
         };
         console.log(this.state.messages);

  }

  componentDidMount(){
    this.socket.emit('ClientRoom',{});
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
           this.addMessage(data);
       });
  }

  addMessage(data){
    console.log(data);
    this.setState({
      messages: this.state.messages.concat([[data.message,
                                             data.sender,
                                             data.time ]])
    });
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
                room: this.socket.id,
                sender: 'client',
                time: Date.now()
            });
            this.setState({message: ''});
  }

  handleKeyPress(e){
    if (e.keyCode === 13 || e.charCode === 13) {
      this.handleSubmit(e);
    }
  }

  render(){
    return(
      <div className="client-chat-container"
           id={`client-chat-container-${this.props.roomId}`}>
        <div className="client-header">
          <p>AGENT</p>
        </div>
        <hr/>
        <CustomerChatBody color = {this.props.color}
                          roomId = {this.props.roomId}
                          messages = {this.state.messages}/>
        <div className="client-input">
          <form onSubmit={this.handleSubmit}>
            <textarea rows="7"
                      onChange={this.handleUpdate("message")}
                      onKeyPress={this.handleKeyPress}
                      value={this.state.message}
                      placeholder="Type a message..."/>
          </form>
        </div>
      </div>
    );
  }
}

export default ClientDashboard;

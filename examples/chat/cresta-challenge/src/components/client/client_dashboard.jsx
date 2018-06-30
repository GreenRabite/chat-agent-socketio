import React from 'react';
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
  }

  componentDidMount(){
    this.socket.emit('ClientRoom',{});
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
           console.log(data);
           this.addMessage(data);
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
                room: this.socket.id
            });
            this.setState({message: ''});
  }

  handleKeyPress(e){
    if (e.keyCode === 13 || e.charCode === 13) {
      this.handleSubmit(e);
    }
  }

  render(){
    let messages = this.state.messages.map(message=>{
      return <li>{`${message}`}</li>;
    });
    return(
      <div className="client-chat-container">
        <div className="client-header">
          <p>AGENT</p>
        </div>
        <hr/>
        <div className="client-chat">
          <ul>
            {messages}
          </ul>
        </div>
        <div className="client-input">
          <form onSubmit={this.handleSubmit}>
            <textarea rows="5"
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

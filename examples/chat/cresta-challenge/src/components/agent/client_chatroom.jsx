import React from 'react';
import './client-chatroom.css';

class ClientChatroom extends React.Component{
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
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
           this.addMessage(data);
       });
  }

  addMessage(data){
    console.log(data);
    this.setState({
      messages: this.state.messages.concat([[data.message,data.sender]])
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
                room: this.props.roomId,
                sender: 'agent'
            });
            this.setState({message: ''});
  }

  handleKeyPress(e){
    if (e.keyCode === 13 || e.charCode === 13) {
      this.handleSubmit(e);
    }
  }

  render(){
    const divStyle = {
      background: this.props.color
    };
    let messages = this.state.messages.map(message=>{
      if (message[1] === 'client') {
        return <div className="ag-client-msg-container"><div className="messages-agent ag-client-msg" style={{backgound:"white"}}>{`${message[0]}\n`} </div></div>;
      }else {
        return <div className="ag-agent-msg-container"><div className="messages-agent ag-agent-msg" style={divStyle}>{`${message[0]}\n`}</div></div>;
      }
    });
    return(
      <div className="agent-chat-container">
        <div className="agent-header">
          <p>{this.props.username}</p>
        </div>
        <hr/>
        <div className="agent-chat">
          {messages}
        </div>
        <div className="agent-input">
          <form onSubmit={this.handleSubmit}>
            <textarea rows="6"
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

export default ClientChatroom;

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
    const divStyle = {
      background: this.props.color
    };
    let messages = this.state.messages.map(message=>{
      if (message[1] === 'client') {
        return <div className="client-msg-container"><div className="messages-client client-msg" style={divStyle}>{`${message[0]}\n`}</div></div>;
      }else {
        return <div className="agent-msg-container"><div className="messages-client agent-msg" style={{backgound:"white"}}>{`${message[0]}\n`}</div></div>;
      }
    });
    return(
      <div className="client-chat-container">
        <div className="client-header">
          <p>AGENT</p>
        </div>
        <hr/>
        <div className="client-chat">
          {messages}
        </div>
        <div className="client-input">
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

export default ClientDashboard;

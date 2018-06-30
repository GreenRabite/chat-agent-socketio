import React from 'react';
import io from "socket.io-client";
import './chat.css';

class ConversationContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
           username: '',
           message: '',
           messages: []
         };
    this.handleUpdate=this.handleUpdate.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.addMessage=this.addMessage.bind(this);
    this.socket = io('localhost:3000');
    this.socket.emit('CONNECTED', {

    })
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
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
                message: this.state.message
            });
            this.setState({message: ''});
  }

  render(){
    let messages = this.state.messages.map(message=>{
      return <li>{`${message}`}</li>;
    });
    return(
      <div>
        Chat
        <ul>
          {messages}
        </ul>
        <div>
          <form>
            <label> Message:
              <input type="text" onChange={this.handleUpdate("message")} value={this.state.message}/>
            </label>
            <button onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ConversationContainer;

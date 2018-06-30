import React from 'react';
import ConversationContainer from '../conversation/conversation_container';

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
           clients: {}
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
                message: this.state.message,
                room: Object.keys(this.state.clients)[0]
            });
            this.setState({message: ''});
  }

  render(){
    let messages = this.state.messages.map(message=>{
      return <li>{`${message}`}</li>;
      });
    return(
      <div className="client-chat-container">
        <div className="client-header">
          <p>CLIENT</p>
        </div>
        <hr/>
        <div className="client-chat">
          <ul>
            {messages}
          </ul>
        </div>
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

export default Dashboard;

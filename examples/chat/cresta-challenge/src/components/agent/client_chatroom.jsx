import React from 'react';
import './client-chatroom.css';

class ClientChatroom extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.grabSuggestions = this.grabSuggestions.bind(this);
    this.handleSuggestion = this.handleSuggestion.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.state = {
           username: this.props.username,
           suggestion: true,
           suggestions: [],
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
    if (data.room === this.props.roomId) {
      this.setState({
        messages: this.state.messages.concat([[data.message,data.sender]])
      });
    }
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
    const suggestCon = document.querySelector(`#suggestion-${this.props.roomId}`);
    if (suggestCon !== null) {
      suggestCon.classList.add('hidden');
    }
  }

  handleKeyPress(e){
    if (e.keyCode === 13 || e.charCode === 13) {
      this.handleSubmit(e);
    }else if (this.state.suggestion) {
      this.grabSuggestions();
    }
  }

  setTimer(){
    let min = 3;
    let max = 5;
    const rand = Math.floor(Math.random() * (max - min + 1) + min);
    setTimeout(()=>{
      this.setState({
        suggestion: true
      });
    }, rand * 1000);
  }

  grabSuggestions(){
    if (this.state.suggestion) {
      this.setState({suggestion: false});
      this.setTimer();
      fetch('https://dev.cresta.ai/api/front_end_challenge')
        .then(function(res){
          return res.json();
        })
        .then(json => {
          if (json.error) {
            console.log('Error occurred');
          }else {
            let suggestions = [];
            let index = 0;
            json.forEach(suggestion => {
              suggestions.push(suggestion[`suggestion ${index}`]);
              index++;
            });
            const suggestCon = document.querySelector(`#suggestion-${this.props.roomId}`);
            if (suggestCon !== null) {
              suggestCon.classList.remove('hidden');
            }
            return this.setState({
              suggestions
            });
          }
        });
    }
  }

  handleSuggestion(e){
    e.preventDefault();
    const suggestCon = document.querySelector(`#suggestion-${this.props.roomId}`);
    suggestCon.classList.add('hidden');
    this.setState({
      message: e.target.innerText
    });
    setTimeout(()=>{
      const input = document.querySelector(`#agent-chat-container-${this.props.roomId} .agent-input textarea`);
      console.log(input);
      input.focus();
    },0);
  }

  handleFocus(e){
    const container = document.querySelector(`#agent-chat-container-${this.props.roomId}`);
    const input = container.querySelector(`.agent-input`);
    const name = container.querySelector(`#agent-${this.props.roomId}`);
    container.classList.add('focus');
    input.classList.add('text-focus');
    name.classList.add('name-focus');
  }

  handleBlur(){
    const container = document.querySelector(`#agent-chat-container-${this.props.roomId}`);
    const input = container.querySelector(`.agent-input`);
    const name = container.querySelector(`#agent-${this.props.roomId}`);
    container.classList.remove('focus');
    input.classList.remove('text-focus');
    name.classList.remove('name-focus');
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
    let speechbubbles = this.state.suggestions.map(suggestion =>{
      return <div className='suggestion-item'
                  onClick={this.handleSuggestion}><span>{suggestion}</span></div>;
    });
    return(
      <div onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           className="agent-chat-container"
           id={`agent-chat-container-${this.props.roomId}`}>
        <div className="agent-header">
          <p id={`agent-${this.props.roomId}`}>{this.props.username}</p>
        </div>
        <hr/>
        <div className="agent-chat">
          {messages}
        </div>
        <div id={`suggestion-${this.props.roomId}`} className='speech-bubble-container hidden'>
          <div className="flex speech-bubble">{speechbubbles}</div>
        </div>
        <div className="agent-input">
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

export default ClientChatroom;

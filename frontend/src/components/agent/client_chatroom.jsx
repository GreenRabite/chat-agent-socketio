import React from 'react';
import ChatHeader from './chat_header/chat_header';
import ChatBody from './chat_body/chat_body';
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
    if (data.room === this.props.roomId) {
      this.setState({
        messages: this.state.messages.concat([[data.message,
                                               data.sender,
                                               data.time ]])
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
                sender: 'agent',
                time: Date.now()
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
    let min = 2;
    let max = 3;
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
      const input = document.querySelector(`#agent-chat-container-${this.props.roomId} .agent-input textarea`);
      input.focus();
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
    let speechbubbles = this.state.suggestions.map(suggestion =>{
      return <div className='suggestion-item'
                  key={suggestion}
                  onClick={this.handleSuggestion}><span>{suggestion}</span></div>;
    });
    return(
      <div onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           className="agent-chat-container"
           id={`agent-chat-container-${this.props.roomId}`}>
        <ChatHeader roomId={this.props.roomId}
                    username={this.props.username}
                    color={this.props.color}
                    socket={this.socket}/>
        <hr/>
        <ChatBody color = {this.props.color}
                  socket = {this.socket}
                  roomId = {this.props.roomId}
                  messages = {this.state.messages}/>
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

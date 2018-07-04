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
    this.getTimer = this.getTimer.bind(this);
    this.timeSince = this.timeSince.bind(this);
    this.timer = 0;
    this.state = {
           username: this.props.username,
           suggestion: true,
           suggestions: [],
           message: '',
           messages: [],
           lastMsgTime: 'N/A',
           seconds: 0
         };

  }

  componentDidMount(){
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
           this.addMessage(data);
           if (data.sender === 'client' && data.room === this.props.roomId) {
             if (this.timer !== 0) {
               clearInterval(this.timer);
               this.timer = 0;
               this.setState({
                 lastMsgTime: `0s`,
                 seconds: 0
               });
             }else {
               this.setState({
                 lastMsgTime: `0s`
               });
             }
             this.getTimer(data);
           }
       });
  }

  addMessage(data){
    console.log(data);
    if (data.room === this.props.roomId) {
      this.setState({
        messages: this.state.messages.concat([[data.message,
                                               data.sender,
                                               data.time ]])
      });
    }
  }

  getTimer(data){
    console.log(data);
    console.log(this.timeSince(data.time));
    if (this.timer === 0){
      this.timer = setInterval(()=>{
        let seconds = this.state.seconds + 1;
        if (seconds < 60) {
          this.setState({
            lastMsgTime: `${seconds}s`,
            seconds
          });
        }else if (seconds >= 60 && seconds < 3600) {
          this.setState({
            lastMsgTime: `${Math.floor(seconds / 60)}m`,
            seconds
          });
        }else {
          this.setState({
            lastMsgTime: `${Math.floor(seconds / 3600)}h`,
            seconds
          });
        }
      },1000);
    }
  }

  timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
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
    let sinceLastMsg;
    if (this.state.messages.length > 0) {
      const msgs = this.state.messages;
      console.log('in the initial loop');
      if (msgs[msgs.length - 1][1] === 'agent') {
        console.log("in the message loop");
        console.log(msgs[msgs.length - 1][1]);
        sinceLastMsg = <div>{this.timeSince(msgs[msgs.length - 1][2])}</div>;
      }
    }
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
          <div class="dot" style={divStyle}>{this.state.lastMsgTime}</div>
        </div>
        <hr/>
        <div className="agent-chat">
          {messages}
          {sinceLastMsg ? sinceLastMsg : ''}
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

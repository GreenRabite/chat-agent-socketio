import React from 'react';
import './chat-header.css';

class ChatHeader extends React.Component{
  constructor(props){
    super(props);
    this.timer = 0;
    this.socket = this.props.socket;
    this.state = {
      lastMsgTime: 'N/A',
      seconds: 0
    };
  }

  componentDidMount(){
    this.socket.on('RECEIVE_MESSAGE', (data)=>{
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

  getTimer(data){
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

  render(){
    const divStyle = {
      background: this.props.color
    };
    return(
      <div className="agent-header">
        <p id={`agent-${this.props.roomId}`}>{this.props.username}</p>
        <div className="dot" style={divStyle}>{this.state.lastMsgTime}</div>
      </div>
    );
  }
}

export default ChatHeader;

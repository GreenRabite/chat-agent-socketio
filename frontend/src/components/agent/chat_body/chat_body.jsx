import React from 'react';
import './chat-body.css';

class ChatBody extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    this.timeSince = this.timeSince.bind(this);
    this.borderCheck = this.borderCheck.bind(this);
    this.updateLastTime = this.updateLastTime.bind(this);
    this.timer = 0;
    this.state = {
      chatBorders: [],
      sinceLastMsg: ''
    };
  }

  timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return 'just now';
  }

  updateLastTime(){
    if (this.props.messages.length > 0) {
      this.timer = setInterval(()=>{
        let msgs = this.props.messages;
        this.setState({
          sinceLastMsg: `${this.timeSince(msgs[msgs.length - 1][2])}`
        });
      }, 500);
    }
  }

  borderCheck(){
    const chatBorders = [];
    const msgs = this.props.messages;
    for (let i = 0; i < msgs.length; i++) {
      if (i === 0) {
        if (msgs[i][1] === 'agent' && msgs[i+1][1] === 'agent'){
          chatBorders.push('RD');
        }else if (msgs[i][1] === 'client' && msgs[i+1][1] === 'client') {
          chatBorders.push('LD');
        }else {
          chatBorders.push('NADA');
        }
      }else if (i > 0 && i < msgs.length - 1) {
        if (msgs[i][1] === 'agent' && msgs[i + 1][1] === 'agent' && msgs[i -1][1] === 'agent') {
          chatBorders.push('RUD');
        }else if (msgs[i][1] === 'agent' && msgs[i + 1][1] === 'agent') {
          chatBorders.push('RD');
        }else if (msgs[i][1] === 'agent' && msgs[i - 1][1] === 'agent') {
          chatBorders.push('RU');
        }else if (msgs[i][1] === 'client' && msgs[i + 1][1] === 'client' && msgs[i - 1][1] === 'client') {
          chatBorders.push('LUD');
        }else if (msgs[i][1] === 'client' && msgs[i + 1][1] === 'client') {
          chatBorders.push('LD');
        }else if (msgs[i][1] === 'client' && msgs[i - 1][1] === 'client') {
          chatBorders.push('LU');
        }else {
          chatBorders.push('NADA');
        }
      }else if (i === msgs.length - 1) {
        if (msgs[i][1] === 'agent' && msgs[i - 1][1] === 'agent'){
          chatBorders.push('RU');
        }else if (msgs[i][1] === 'client' && msgs[i - 1][1] === 'client') {
          chatBorders.push('LU');
        }else {
          chatBorders.push('NADA');
        }
      }
    }
    this.setState({chatBorders: chatBorders});
  }

  render(){
    const divStyle = {
      background: this.props.color
    };
    const lastMsgStyleSender ={
      textAlign: 'right',
      marginRight: '25px'
    };
    const lastMsgStyleReceiver ={
      textAlign: 'left',
      marginLeft: '34px'
    };
    let messages = this.props.messages.map(message=>{
      if (message[1] === 'client') {
        return <div className='ag-client-msg-container'><div className="messages-agent ag-client-msg" style={{backgound:"white"}}>{`${message[0]}\n`} </div></div>;
      }else {
        return <div className="ag-agent-msg-container"><div className="messages-agent ag-agent-msg" style={divStyle}>{`${message[0]}\n`}</div></div>;
      }
    });
    let sinceLastMsg;
    if (this.props.messages.length > 0) {
      const msgs = this.props.messages;
      if (this.timer === 0) {
        this.updateLastTime();
      }
      if (msgs[msgs.length - 1][1] === 'agent') {
        sinceLastMsg = <div className='a-last-msg-agent' style={lastMsgStyleSender}>
                        {this.state.sinceLastMsg}
                      </div>;
      }else {
        sinceLastMsg = <div className='a-last-msg-agent' style={lastMsgStyleReceiver}>
                        {this.state.sinceLastMsg}
                      </div>;
      }
    }
    if (this.props.messages.length > 1 && this.props.messages.length !== this.state.chatBorders.length) {
      this.borderCheck();
    }
    if (this.props.messages.length > 1 && this.props.messages.length === this.state.chatBorders.length) {
      const container = document.querySelector(`#agent-chat-container-${this.props.roomId}`);
      const chatBubbles = [...container.querySelectorAll('.messages-agent')];
      for (let i = 0; i < this.state.chatBorders.length; i++) {
        let shape;
        let margin;
        if (this.state.chatBorders[i] === 'RU') {
          shape = 'bubble-right-up';
          margin = 'margin-bot-diff';
        }else if (this.state.chatBorders[i] === 'RD') {
          shape = 'bubble-right-down';
          margin = 'margin-bot-same';
          if (chatBubbles[i].classList.contains('margin-bot-diff')) chatBubbles[i].classList.remove('margin-bot-diff');
        }else if (this.state.chatBorders[i] === 'RUD') {
          shape = 'bubble-right';
          margin = 'margin-bot-same';
          if (chatBubbles[i].classList.contains('margin-bot-diff')) chatBubbles[i].classList.remove('margin-bot-diff');
        }else if (this.state.chatBorders[i] === 'LU') {
          shape = 'bubble-left-up';
          margin = 'margin-bot-diff';
        }else if (this.state.chatBorders[i] === 'LD') {
          shape = 'bubble-left-down';
          margin = 'margin-bot-same';
          if (chatBubbles[i].classList.contains('margin-bot-diff')) chatBubbles[i].classList.remove('margin-bot-diff');
        }else if (this.state.chatBorders[i] === 'LUD') {
          shape = 'bubble-left';
          margin = 'margin-bot-same';
          if (chatBubbles[i].classList.contains('margin-bot-diff')) chatBubbles[i].classList.remove('margin-bot-diff');
        }else {
          margin = 'nada';
        }
        if (margin !== 'nada') {
          chatBubbles[i].classList.add(margin);
        }
        chatBubbles[i].classList.add(shape);
      }
    }
    return(
      <div className="agent-chat">
        {messages}
        {sinceLastMsg ? sinceLastMsg : ''}
      </div>
    );
  }
}

export default ChatBody;

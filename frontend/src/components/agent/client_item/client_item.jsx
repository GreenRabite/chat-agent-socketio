import React from 'react';
import './client-item.css';


class ClientItem extends React.Component{
  constructor(props){
    super(props);
    this.timer = 0;
    this.urgentChatCheck = this.urgentChatCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.urgentChatCheck();
    console.log('mounted');
  }

  handleClick(){
    const input = document.querySelector(`#agent-chat-container-${this.props.roomId} .agent-input textarea`);
    input.focus();
    input.scrollIntoView();
  }

  urgentChatCheck(){
    console.log("working");
    if (this.timer === 0) {
      this.timer = setInterval(()=>{
        console.log('in the loop');
        const dot = document.querySelector(`#agent-chat-container-${this.props.roomId} .agent-header .dot`);
        const clientItem = document.querySelector(`#client-item-${this.props.roomId}`);
        console.log(dot);
        if (dot && dot.innerText[dot.innerText.length -1] === 's') {
          let value = parseInt(dot.innerText.slice(0,dot.innerText.length -1));
          if (value < 30) {
            clientItem.classList.add('red-chat');
          }else if (value <= 59 && value > 30) {
            clientItem.classList.remove('red-chat');
            clientItem.classList.add('yellow-chat');
          }
        }else {
          if (clientItem.classList.contains('red-chat')){ clientItem.classList.remove('red-chat'); }
          if (clientItem.classList.contains('yellow-chat')){ clientItem.classList.remove('yellow-chat'); }
        }
      },1000);
    }
  }

  render(){
    return(
      <div className="client-item"
           id={`client-item-${this.props.roomId}`}
           key={this.props.roomId}
           onClick={this.handleClick}>
            {this.props.username}
      </div>
    );
  }
}

export default ClientItem;

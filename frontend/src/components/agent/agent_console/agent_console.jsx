import React from 'react';
import '../dashboard.css';

class AgentConsole extends React.Component{
  constructor(props){
    super(props);
    this.timer = 0;
    this.setTimer = this.setTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      online: 0,
      offline: 0,
      current: 'online'
    };
  }

  componentDidMount(){
    this.setTimer();
  }

  setTimer(){
    if (this.timer === 0) {
      this.timer = setInterval(()=>{
        let nextTime;
        if (this.state.current === 'online') {
          nextTime = this.state.online + 1;
          this.setState({ online: nextTime});
        }else if (this.state.current === 'offline') {
          nextTime = this.state.offline + 1;
          this.setState({ offline: nextTime});
        }
      },1000);
    }
  }

  formatTime(time){
    let hours = Math.floor(time / 3600);
    hours = hours > 9 ? hours : `0${hours}`;
    let leftover = time % 3600;
    let minutes = Math.floor(leftover / 60);
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    leftover = leftover % 60;
    leftover = leftover > 9 ? leftover : `0${leftover}`;
    return `${hours}:${minutes}:${leftover}`;
  }

  stopTimer(){
    clearInterval(this.timer);
    this.timer = 0;
    if (this.state.current === 'online') {
      this.setState({ current: 'offline' });
    }else {
      this.setState({ current: 'online' });
    }
    this.setTimer();
  }

  handleClick(field){
    if (field !== this.state.current) {
      this.stopTimer();
      const dropdown = document.querySelector('.dropdown');
      const dot = document.querySelector('#dot-status');
      if (field === 'online') {
        const status = document.querySelector('#status');
        status.innerText = 'ONLINE';
        dropdown.classList.add('green-border');
        dot.classList.remove('dot-status-empty');
        dot.classList.add('dot-status');
        if (dropdown.classList.contains('gray-border')){
          dropdown.classList.remove('gray-border');
        }
      }else {
        const status = document.querySelector('#status');
        status.innerText = 'OFFLINE';
        dropdown.classList.add('gray-border');
        dot.classList.remove('dot-status');
        dot.classList.add('dot-status-empty');
        if (dropdown.classList.contains('green-border')){
          dropdown.classList.remove('green-border');
        }
      }
    }
  }

  render(){
    return(
      <div id="agent-console">
        <div id="counter-container">
          <div id="counter-away"><span className='bold'>AWAY</span> - {this.formatTime(this.state.offline)}</div>
          <span className="vr">|</span>
          <div id="counter-online"><span className='bold'>ONLINE</span> - {this.formatTime(this.state.online)}</div>
        </div>
        <div className='dropdown green-border'>
          <span id='dot-status' className='dot-status'>.</span><span id='status' className='bold status'>ONLINE</span> <i className="fas fa-caret-down"></i>
          <div className='dropdown-menu'>
            <div className='dropdown-item di-top' onClick={()=>this.handleClick('online')}>
              <span className='dot-status'>.</span>ONLINE
            </div>
            <div className='dropdown-item di-bottom' onClick={()=>this.handleClick('offline')}>
              <span className='dot-status-empty'>.</span>OFFLINE
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AgentConsole;

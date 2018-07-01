import React from 'react';
import './nav-footer.css';

class NavFooter extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
    this.state = {
      clients : {}
    };
  }

  render(){
    let clients = Object.values(this.props.clients).map(client => {
      return <div className="client-item" key={client}>{client}</div>;
    });
    return(
      <div id="nav-footer">
        <h3>Client List</h3>
        {clients}
      </div>
    );
  }
}

export default NavFooter;

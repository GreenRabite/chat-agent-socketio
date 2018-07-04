import React from 'react';
import ClientItem from './client_item/client_item';
import './nav-footer.css';

class NavFooter extends React.Component{
  constructor(props){
    super(props);
    this.socket = this.props.socket;
  }

  render(){
    let clients = this.props.clients;
    let names = [];
    if (Object.values(clients).length > 0) {
      for (const roomId in clients) {
        if (Object.prototype.hasOwnProperty.call(clients,roomId)){
          names.push(
            <ClientItem roomId={roomId}
              username={this.props.clients[roomId]}/>
          );
        }
      }
    }
    return(
      <div id="nav-footer">
        <h3>Client List</h3>
        {names}
      </div>
    );
  }
}

export default NavFooter;

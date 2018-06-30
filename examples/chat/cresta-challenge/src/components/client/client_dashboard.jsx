import React from 'react';

class ClientDashboard extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  render(){
    return(
      <div>
        <h1>Hi {this.props.username}</h1>

      </div>

    );
  }
}

export default ClientDashboard;

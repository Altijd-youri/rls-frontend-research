import React, { Component } from 'react'

class UserForm extends Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    
    handleSubmit(e) {
      alert('The value is: ' + this.input.value);
      e.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
          companyCode:
            <input name="companyCode" id="companyCode" type="text" ref={(input) => this.input = input} />
          </label>
          {/* <label>
            Name:
            <input id="surname" name="surname"type="text" ref={(input) => this.input = input} />
          </label>
          <label>
            Name:
            <input name="lastname" id="lastname" type="text" ref={(input) => this.input = input} />
          </label>
          <label>
            Name:
            <input name="email" id="email" type="text" ref={(input) => this.input = input} />
          </label> */}
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

  export default UserForm;
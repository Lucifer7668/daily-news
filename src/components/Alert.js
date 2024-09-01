import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Alert extends Component {
    static propTypes = {
        alert: PropTypes.array
      };
  render() {
    
    const capitalize=(word)=>{
        const lower=word.toLowerCase();
        return lower.charAt(0).toUpperCase()+lower.slice(1)
    }
  return (
   
    <div style={{height:"80px"}}>
        {this.props.alert &&
   <div className={`alert alert-${this.props.alert.type} alert-dismissible fade show`} role="alert">
  <strong>{capitalize(this.props.alert.type)}</strong>:{this.props.alert.message}
</div>}</div>
  )
  }
}

export default Alert

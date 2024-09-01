import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Category extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="container my-3 d-flex center">
        {this.props.categories.map((element) => (
          <button
            key={element}
            type="button"
            className="btn btn-dark mx-3"
            onClick={() => this.props.onCategoryChange(element)} // Pass the category value
          >
            {element.charAt(0).toUpperCase() + element.slice(1)}
          </button>
        ))}
      </div>
    );
  }
}

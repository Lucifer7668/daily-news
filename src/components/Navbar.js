import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class Navbar extends Component {
  static propTypes = {
    countries: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired, // Make sure you have categories in PropTypes
    onCountryChange: PropTypes.func.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    selectedCountry: PropTypes.string.isRequired,
    selectedType: PropTypes.string.isRequired,
    searchQuery: PropTypes.string, // Changed from isRequired to optional
  };
  handleCategoryClick = (category) => {
    // Call the onCategoryChange function passed from props
    this.props.onCategoryChange(category);
  };
  render() {
    const selectedCountryOption = this.props.countries.find(
      (country) => country.value === this.props.selectedCountry
    );
    const typeOptions = this.props.types.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
    const selectedTypeOption = typeOptions.find(
      (type) => type.value === this.props.selectedType
    );

    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Daily News
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link key="home" className="nav-link" onClick={() => this.handleCategoryClick("general")} to="/">
                    Home
                  </Link>
                </li>
                {this.props.selectedType==='top-headlines' && this.props.categories.map((element) => (
                  <li  onClick={() => this.handleCategoryClick(element)} className="nav-item" key={element}>
                    <Link
                      className="nav-link"
                      to={`/${element}`}
                    >
                      {element.charAt(0).toUpperCase() + element.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Select
                value={selectedTypeOption}
                options={typeOptions}
                onChange={this.props.onTypeChange}
                placeholder="Select type of news"
                className="me-2 mt-2"
                classNamePrefix="react-select"
              />
              {this.props.selectedType === 'everything' && (
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2 mt-2"
                    type="search"
                    value={this.props.searchQuery}
                    name="q"
                    onChange={this.props.onSearchChange}
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
              )}
              {this.props.selectedType === 'top-headlines' && (
                <Select
                  value={selectedCountryOption}
                  options={this.props.countries}
                  onChange={this.props.onCountryChange}
                  placeholder="Select a country"
                  className="me-2 mt-2"
                  classNamePrefix="react-select"
                />
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Navbar;

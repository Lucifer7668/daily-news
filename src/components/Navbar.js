import React from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const Navbar =(props)=> {
  
 const handleCategoryClick = (category) => {
    // Call the onCategoryChange function passed from props
    props.onCategoryChange(category);
  };
  
    const selectedCountryOption = props.countries.find(
      (country) => country.value === props.selectedCountry
    );
    const typeOptions = props.types.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
    const selectedTypeOption = typeOptions.find(
      (type) => type.value === props.selectedType
    );

    return (
      <>
        <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
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
                  <Link key="home" className="nav-link" onClick={() => handleCategoryClick("general")} to="/">
                    Home
                  </Link>
                </li>
                {props.selectedType==='top-headlines' && props.categories.map((element) => (
                  <li  onClick={() => handleCategoryClick(element)} className="nav-item" key={element}>
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
                onChange={props.onTypeChange}
                placeholder="Select type of news"
                className="me-2 mt-2"
                classNamePrefix="react-select"
              />
              {props.selectedType === 'everything' && (
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2 mt-2"
                    type="search"
                    value={props.searchQuery}
                    name="q"
                    onChange={props.onSearchChange}
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
              )}
              {props.selectedType === 'top-headlines' && (
                <Select
                  value={selectedCountryOption}
                  options={props.countries}
                  onChange={props.onCountryChange}
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

export default Navbar;

import './App.css';
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import { Offline, Online } from 'react-detect-offline';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: process.env.REACT_APP_NEWS_API,
      countries: [],
      selectedCountry: 'IN',
      selectedType: 'top-headlines',
      selectedCategory: 'general',
      types: ['top-headlines', 'everything'],
      categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
      searchQuery: '',
      articles: [],
      loading: true,
      apiUrl: 'https://newsapi.org/v2/',
      alert: null,
      page: 1,
      totalPages: 0,
      progress: 0,
      categoryBadgeColors: {
        business: "text-bg-success",
        entertainment: "text-bg-warning",
        general: "text-bg-secondary",
        health: "text-bg-info",
        science: "text-bg-primary",
        sports: "text-bg-danger",
        technology: "text-bg-dark",
      },
    };
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    document.title = `${this.state.selectedCategory.toLowerCase().charAt(0).toUpperCase() + this.state.selectedCategory.slice(1)} - Daily News`;
  }

  async fetchNewsData(page) {
    if (!navigator.onLine) {
      toast.error('No Internet Connection');
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: true, progress: 30 });
    let url = '';
    if (this.state.selectedType === 'top-headlines') {
      url = `${this.state.apiUrl}${this.state.selectedType}?country=${this.state.selectedCountry}&category=${this.state.selectedCategory}&apiKey=${this.state.apiKey}&page=${page}&pageSize=12`;
    } else if (this.state.selectedType === 'everything') {
      if (this.state.searchQuery && this.state.searchQuery.trim() !== '') {
        url = `${this.state.apiUrl}${this.state.selectedType}?q=${this.state.searchQuery}&apiKey=${this.state.apiKey}&page=${page}&pageSize=12`;
      } else {
        toast.error('Please enter something in the search field.');
        this.setState({ loading: false });
        return;
      }
    }

    try {
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      let parsedData = await data.json();
      let totalPages = parsedData.totalResults / 12;

      if (parsedData.status === 'error') {
        toast.error(parsedData.message);
        this.setState({ loading: true });
      } else {
        this.setState(prevState => ({
          progress: 70,
          articles: [...prevState.articles, ...parsedData.articles], // Append new articles to existing ones
          loading: false,
          totalPages: totalPages,
        }));
        this.setState({ progress: 100 });
      }
    } catch (error) {
      toast.error('Error fetching data. Please try again later.');
      this.setState({ loading: false, progress: 100 });
      console.error('Failed to fetch data: ', error);
    }
  }

  handleConnectivityChange = (isOnline) => {
    if (!isOnline) {
      toast.error('No Internet Connection');
    } else {
      toast.success('Internet Connected');
      if (!this.state.articles.length) {
        this.fetchNewsData(this.state.page);
      }
    }
  };

  async componentDidMount() {
    window.addEventListener('online', () => this.handleConnectivityChange(true));
    window.addEventListener('offline', () => this.handleConnectivityChange(false));

    if (navigator.onLine) {
      await this.fetchNewsData(this.state.page);
      this.fetchCountryData();
    }
  }

  async fetchCountryData() {
    let countryUrl = 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json';
    try {
      let countryData = await fetch(countryUrl);
      let countryParsedData = await countryData.json();
      const transformedCountries = countryParsedData.map((country) => ({
        value: country.code,
        label: `${country.emoji} ${country.name}`,
      }));
      this.setState({ countries: transformedCountries });
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedCountry, selectedType, selectedCategory, searchQuery, page } = this.state;

    if (
      prevState.selectedCountry !== selectedCountry ||
      prevState.selectedType !== selectedType ||
      prevState.selectedCategory !== selectedCategory ||
      prevState.searchQuery !== searchQuery ||
      prevState.page !== page
    ) {
      this.fetchNewsData(page);
    }
    if (prevState.selectedCategory !== selectedCategory) {
      document.title = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} - Daily News`;
    }
  }

  handleNextClick = () => {
    if (navigator.onLine) {
      this.setState(prevState => ({
        page: prevState.page + 1
      }), () => {
        this.fetchNewsData(this.state.page);
      });
    } else {
      toast.error('No Internet Connection');
    }
  };

  handlePrevClick = () => {
    if (navigator.onLine) {
      this.setState({ page: this.state.page - 1 });
    } else {
      toast.error('No Internet Connection');
    }
  };

  handleCountryChange(selectedOption) {
    this.setState({ selectedCountry: selectedOption.value, page: 1 });
  }

  handleSearchChange(event) {
    this.setState({ searchQuery: event.target.value, page: 1 });
  }

  handleTypeChange(selectedOption) {
    this.setState({ selectedType: selectedOption.value, page: 1 });
  }

  handleCategoryChange(category) {
    this.setState({ selectedCategory: category, page: 1, articles: [] }); // Reset articles to append new data
  }

  render() {
    return (
      <Router>
        <div>
          <LoadingBar color="#f11946" progress={this.state.progress} onLoaderFinished={() => this.setState({ progress: 0 })} />
          <Offline></Offline>
          <Online></Online>
          <Navbar
            types={this.state.types}
            countries={this.state.countries}
            onCountryChange={this.handleCountryChange}
            selectedCountry={this.state.selectedCountry}
            selectedType={this.state.selectedType}
            onTypeChange={this.handleTypeChange}
            searchQuery={this.state.searchQuery}
            onSearchChange={this.handleSearchChange}
            categories={this.state.categories}
            onCategoryChange={this.handleCategoryChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <News
                  selectedCountry={this.state.selectedCountry}
                  countries={this.state.countries}
                  selectedType={this.state.selectedType}
                  selectedCategory={this.state.selectedCategory}
                  searchQuery={this.state.searchQuery}
                  articles={this.state.articles}
                  loading={this.state.loading}
                  handleNextClick={this.handleNextClick}
                  handlePrevClick={this.handlePrevClick}
                  page={this.state.page}
                  totalPages={this.state.totalPages}
                  badgeColor={this.state.categoryBadgeColors[this.state.selectedCategory]}
                />
              }
            />
            <Route
              exact
              path="/:category"
              element={
                <News
                  selectedCountry={this.state.selectedCountry}
                  selectedCategory={this.state.selectedCategory}
                  countries={this.state.countries}
                  selectedType={this.state.selectedType}
                  searchQuery={this.state.searchQuery}
                  articles={this.state.articles}
                  loading={this.state.loading}
                  handleNextClick={this.handleNextClick}
                  handlePrevClick={this.handlePrevClick}
                  page={this.state.page}
                  totalPages={this.state.totalPages}
                  badgeColor={this.state.categoryBadgeColors[this.state.selectedCategory]}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    );
  }
}

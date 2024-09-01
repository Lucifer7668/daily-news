import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import { Offline, Online } from 'react-detect-offline';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [apiKey] = useState(process.env.REACT_APP_NEWS_API);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedType, setSelectedType] = useState('top-headlines');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [types] = useState(['top-headlines', 'everything']);
  const [categories] = useState(['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiUrl] = useState('https://newsapi.org/v2/');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [progress, setProgress] = useState('0');
  const categoryBadgeColors = {
    business: "text-bg-success",
    entertainment: "text-bg-warning",
    general: "text-bg-secondary",
    health: "text-bg-info",
    science: "text-bg-primary",
    sports: "text-bg-danger",
    technology: "text-bg-dark",
  };

  const fetchNewsData = async (page) => {
    if (!navigator.onLine) {
      toast.error('No Internet Connection');
      setLoading(false);
      return;
    }
    setLoading(true);
    setProgress('30');
    let url = '';
    if (selectedType === 'top-headlines') {
      url = `${apiUrl}${selectedType}?country=${selectedCountry}&category=${selectedCategory}&apiKey=${apiKey}&page=${page}&pageSize=12`;
    } else if (selectedType === 'everything') {
      if (searchQuery && searchQuery.trim() !== '') {
        url = `${apiUrl}${selectedType}?q=${searchQuery}&apiKey=${apiKey}&page=${page}&pageSize=12`;
      } else {
        toast.error('Please enter something in the search field.');
        setLoading(false);
        return;
      }
    }

    try {
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      let parsedData = await data.json();
      let totalPages = Math.ceil(parsedData.totalResults / 12);

      if (parsedData.status === 'error') {
        toast.error(parsedData.message);
        setLoading(true);
      } else {
        setArticles(prevArticles => [...prevArticles, ...parsedData.articles]); // Append new articles
        setTotalPages(totalPages);
        setLoading(false);
        setProgress('100');
      }
    } catch (error) {
      toast.error('Error fetching data. Please try again later.');
      setLoading(false);
      setProgress('100');
      console.error('Failed to fetch data: ', error);
    }
  };

  const handleConnectivityChange = (isOnline) => {
    if (!isOnline) {
      toast.error('No Internet Connection');
    } else {
      toast.success('Internet Connected');
      if (!articles.length) {
        fetchNewsData(page);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('online', () => handleConnectivityChange(true));
    window.addEventListener('offline', () => handleConnectivityChange(false));

    if (navigator.onLine) {
      fetchNewsData(page);
      fetchCountryData();
    }

    return () => {
      window.removeEventListener('online', () => handleConnectivityChange(true));
      window.removeEventListener('offline', () => handleConnectivityChange(false));
    };
  }, [page]);

  const fetchCountryData = async () => {
    let countryUrl = 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json';
    try {
      let countryData = await fetch(countryUrl);
      let countryParsedData = await countryData.json();
      const transformedCountries = countryParsedData.map((country) => ({
        value: country.code,
        label: `${country.emoji} ${country.name}`,
      }));
      setCountries(transformedCountries);
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
    setPage(1);
    setArticles([]); // Clear articles when changing country
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
    setArticles([]); // Clear articles when searching
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption.value);
    setPage(1);
    setArticles([]); // Clear articles when changing type
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setArticles([]);
    fetchNewsData(page);
    
  };

  return (
    <Router>
      <div>
        <LoadingBar color="#f11946" progress={progress} onLoaderFinished={() => setProgress('0')} />
        <Offline></Offline>
        <Online></Online>
        <Navbar
          types={types}
          countries={countries}
          onCountryChange={handleCountryChange}
          selectedCountry={selectedCountry}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
        <Routes>
          <Route
            path="/"
            element={
              <News
                selectedCountry={selectedCountry}
                countries={countries}
                selectedType={selectedType}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                articles={articles}
                loading={loading}
                page={page}
                totalPages={totalPages}
                badgeColor={categoryBadgeColors[selectedCategory]}
              />
            }
          />
          <Route
            exact
            path="/:category"
            element={
              <News
                selectedCountry={selectedCountry}
                selectedCategory={selectedCategory}
                countries={countries}
                selectedType={selectedType}
                searchQuery={searchQuery}
                articles={articles}
                loading={loading}
                page={page}
                totalPages={totalPages}
                badgeColor={categoryBadgeColors[selectedCategory]}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

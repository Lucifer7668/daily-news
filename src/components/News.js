import React, { Component } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import "react-loading-skeleton/dist/skeleton.css";

export class News extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    selectedType: PropTypes.string.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    selectedCountry: PropTypes.string.isRequired,
    searchQuery: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    badgeColor: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
  };

  render() {
    return (
      <>
        <h1 className="text-center">
          Daily News -{" "}
          {this.props.selectedType.toLowerCase().charAt(0).toUpperCase() +
            this.props.selectedType.slice(1)}{" "}
          from{" "}
          {this.props.selectedCategory.toLowerCase().charAt(0).toUpperCase() +
            this.props.selectedCategory.slice(1)}
        </h1>
        {this.props.loading && (
          <div className="container">
            <div className="row">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="col-md-3">
                  <Skeleton height={200} />
                  <Skeleton count={3} />
                </div>
              ))}
            </div>
          </div>
        )}
        <InfiniteScroll
          dataLength={this.props.articles.length}
          next={this.props.handleNextClick}
          hasMore={this.props.page < this.props.totalPages}
          loader={
            <div className="container">
              <div className="row">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="col-md-3">
                    <Skeleton height={200} />
                    <Skeleton count={3} />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="container">
            <div className="row">
              {this.props.articles.map((element, index) => (
                <div
                  className="col-md-3 my-3"
                  key={element.url + index || index}
                >
                  <NewsItem
                    key={element.url}
                    title={element.title ? element.title.slice(0, 30) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 90)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                    badgeColor={this.props.badgeColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;

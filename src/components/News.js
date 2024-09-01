import React from "react";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import "react-loading-skeleton/dist/skeleton.css";

const News =(props)=> {
  
    return (
      <>
        <h1 className="text-center" style={{margin:'35px 0px',marginTop:'90px'}}>
          Daily News -{" "}
          {props.selectedType.toLowerCase().charAt(0).toUpperCase() +
            props.selectedType.slice(1)}{" "}
          from{" "}
          {props.selectedCategory.toLowerCase().charAt(0).toUpperCase() +
            props.selectedCategory.slice(1)}
        </h1>
        {props.loading && (
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
          dataLength={props.articles.length}
          next={props.handleNextClick}
          hasMore={props.page < props.totalPages}
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
              {props.articles.map((element, index) => (
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
                    badgeColor={props.badgeColor}
                  />
                </div>
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }

export default News;

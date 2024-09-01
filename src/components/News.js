import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export class News extends Component {
  static propTypes={
    articles:PropTypes.array.isRequired,
    selectedType:PropTypes.string.isRequired,
    selectedCountry:PropTypes.string.isRequired,
    searchedQuery:PropTypes.string.isRequired,
    loading:PropTypes.bool.isRequired
  }
  
  render() {
    if (this.props.loading) {
        return (
          <div className="container my-3">
            <div className="row">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="col-md-3">
                  <Skeleton height={200} />
                  <Skeleton count={3} />
                </div>
              ))}
            </div>
          </div>
        );
      }
    return (
      <div className='container my-3' >
        <h1 className='text-center'>Daily news- {this.props.selectedType.toLowerCase().charAt(0).toUpperCase()+this.props.selectedType.slice(1)}</h1>
        <div className="row">
            {this.props.articles.map((element, index)=>{
                return(
                <div className="col-md-3 my-3" key={element.url || index}>
            <NewsItem key={element.url} title={element.title?element.title.slice(0,30):""} description={element.description?element.description.slice(0,90):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} badgeColor={this.props.badgeColor} />
            </div>)
            })}  
            </div>
            <div className="container d-flex justify-content-between">
                <button disabled={this.props.page<=1} type='button' className="btn btn-dark" onClick={this.props.handlePrevClick}>&larr; Previous</button>
                <button disabled={this.props.page>=this.props.totalPages} type='button' className="btn btn-dark" onClick={this.props.handleNextClick}>Next &rarr;</button>
            </div>
        </div>
      
    )
  }
}

export default News

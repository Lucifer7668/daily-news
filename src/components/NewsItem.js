import React, { Component } from 'react'
export class NewsItem extends Component {
  render() {
    let {title,description,imageUrl,newsUrl,author,date,source,badgeColor}=this.props;

    return (
     <>
            <div className="card">
                <div style={{display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: '0',}}>
                {source && (
            <span className={`badge rounded-pill ${badgeColor}`} style={{ left: '85%', zIndex: '1' }}>
              {source}
            </span>
          )}
                    </div>
                <img src={imageUrl?imageUrl:"https://media.wired.com/photos/66abf037a5ad3066e443d9c7/191:100/w_1280,c_limit/Trump-Project2025-Sec-2164164244.jpg"} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{title}... </h5>
                    <p className="card-text">{description}...</p>
                    <p className="card-text"><small className="text-body-secondary">By {author?author:'unknown'} on {new Date(date).toUTCString()}</small></p>
                    <a href={newsUrl} target='_blank' rel='noreferrer' className="btn btn-sm btn-dark">Read Full News</a>
                </div>
        </div>
     </>
    )
  }
}

export default NewsItem

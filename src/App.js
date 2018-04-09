import React, { Component } from 'react';
import {Grid, Row, FormGroup} from 'react-bootstrap';
// import list from './list'

const DEFAULT_QUERY = "react";
const PATH_BASE     = "https://hn.algolia.com/api/v1";
const PATH_SEARCH   = "/search";
const PARAM_SEARCH  = "query=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`
// console.log(url)

function isSearched(searchTerm){
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    }

    this.removeItem      = this.removeItem.bind(this);
    this.searchValue     = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories   = this.setTopStories.bind(this);
  }

  setTopStories(result) {
    this.setState({result: result})
  }

  fetchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
    .then(response => response.json())
    .then(result => this.setTopStories(result))
    .catch(e => e);
  }

  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm);
  }

  removeItem(id) {
    const {result} = this.state;
    const updatedList = result.hits.filter(item => item.objectId !== id);
    // this.setState({ result: Object.assign({}, result, {hits: updatedList}) });
    this.setState({ result: {...result, hits: updatedList} });
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    
    const { result, searchTerm } = this.state;
    if(!result) { return null; }

    return (
      <div className="App">
      <Grid fluid>
        <Row>
          <div className="jumbotron">
            <Search
              onChange={this.searchValue}
              value={searchTerm}> Search here
            </Search>
          </div>
        </Row>
      </Grid>
        
        <Table
          list={result.hits}
          searchTerm={searchTerm}
          removeItem={this.removeItem}
        />

      </div>
    );
  }
}

class Search extends Component {
  render(){
    const { onChange, value, children } = this.props;
    return(
      <form>
        <FormGroup>
          <h1>{children}</h1>
          <hr style={{border: '2px solid black', width: '100px'}} />
          <div className="input-group">
            <input
              className="form-control width100 searchForm"
              type="text"
              onChange={onChange}
              value={value}
            />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-primary searchBtn">Search</button>
            </span>
          </div>
        </FormGroup>
      </form>
    )
  }
}

class Table extends Component {
  render(){
    const { list, searchTerm, removeItem } = this.props;
    return(
      <div className='col-sm-10 col-sm-offset-1'>
        {
          list.filter(isSearched(searchTerm)).map((item, key) =>

            <div key={key}>
              <h1><a href={item.url}>{item.title}</a></h1>
              <h4>By {item.author} - {item.comments} Comments | {item.points} Points 
                <Button
                  type="button"
                  className='btn btn-danger'
                  onClick={ ()=>removeItem(item.objectId) }>
                  - Remove me -
                </Button>
              </h4> <hr />
            </div>
          )
        }
      </div>
    )
  }
}

// class Button extends Component {
//   render(){
//     const { onClick, children } = this.props;
//     return(
//       <button onClick={onClick}>
//         {children}
//       </button>
//     )
//   }
// }

const Button = ({onClick, children, className=''}) =>
  <button
    className={className}
    onClick={onClick}>
    {children}
  </button>

export default App;

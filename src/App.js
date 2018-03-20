import React, { Component } from 'react';
import {Grid, Row, FormGroup} from 'react-bootstrap';
import list from './list'
import './App.css';

function isSearched(searchTerm){
  return function(item) {
    return !searchTerm || item.title.includes(searchTerm);
  }
}

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      list,
      searchTerm: ''
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  removeItem(id) {
    const updatedList = this.state.list.filter(item => item.objectId !== id);
    this.setState({list: updatedList});
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    
    const { list, searchTerm } = this.state;

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
          list={list}
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
      <div>
        {
          list.filter(isSearched(searchTerm)).map(item =>

            <div key={item.objectId}>
              <h1><a href={item.url}>{item.title}</a> by {item.author}</h1>
              <h4>{item.comments} Comments | {item.points} Points</h4>
              <Button
                type="button"
                onClick={ ()=>removeItem(item.objectId) }>
                - Remove me -
              </Button>
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

const Button = ({onClick, children}) =>
  <button
    onClick={onClick}>
    {children}
  </button>

export default App;

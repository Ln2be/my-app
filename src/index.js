import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';
import * as L from 'leaflet'

class Post extends React.Component {
    render() {
        return (
            <div>
                {this.props.name}
            </div>
        )
    }
}

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            posts: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:3001/posts")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    posts: result
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        )
    }
    render() {
        const {error, isLoaded, posts} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <div>
                    {
                        posts.map(el => <Post name={el.name}></Post>)
                    }
                </div>
            )
        }
    }
}

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null
        }
    }

    handleChange = event => {
        this.setState({
            name:event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault();

        const user = {
            name: this.state.name
        };

        axios.post("http://localhost:3001/add", { user })
        .then(res => {
            console.log(res.data)
            ReactDOM.render(
                <Feed/>,
                document.getElementById('root')
            )
        })
    }
    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>name: </label>
                    <input id="name" name="name" type="text" onChange={this.handleChange}></input>
                    <button type="submit">submit</button>
                </form>
            </div>
        )
    }
}


ReactDOM.render(
    <Add/>,
    document.getElementById('root')
  );
import React, { Component } from 'react';
import Header from './components/Header';
import Secrets from './components/Secrets';
import ErrorMessage from './components/ErrorMessage';
import Bucketlist from './components/Bucketlist';
import Bucket from './components/Bucket';

import './App.css';

class App extends Component {

    state = {
    login: false,
    auth: 'Token',
    bucket: {
      name: '',
      id: '',
      location: {
          name: '',
          id:''
      }
    },
    buckets: [
            {
              id: "-",
              name: "",
              location: {
                id: "-",
                name: ""
              }
            }
          ],
    locations: [],
    objects: [
      {
        name: "",
        modified: "",
        size: 0
      }
    ],
    bucketlist: true,
    errMsg: {
      status: 0,
      message: '',
      component: ''
    },
    errToggle: false
  }

  // Login functions

  handleLogin = (val) => {
    this.setState({
      auth: 'Token ' + val,
    });
  }

  toggleLogin = () => {
    this.setState({login: true});
  }

  /*  returns to the main screen
      used in Header component if the user clicks the H1 title
      used in BucketDetails component when the users deletes a bucket
  */
  goHome = () => {
    let emptyBucket = {
      name: '',
      id: '',
      location: {
          name: '',
          id:''
      }
    }
    this.setState({ bucketlist: true, bucket: emptyBucket });
  }



// toggles views between Bucket and Bucketlist components


  toggleBucket = () => {
    this.setState({bucketlist: false});
  }


  // FETCH GET REQUESTS:

  // single bucket
  fetchBucket = (id) => {
    fetch(`https://challenge.3fs.si/storage/buckets/${id}`, 
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.state.auth
          }
          })
    .then(res => {
      if (res.ok) { res.json().then(data=>this.setState({ bucket: data.bucket })) } else {
        this.setErrorMsg(res.status,res.statusText,'App.js:102');
        console.log(`Error (${res.status}) on fetch Bucket, server response: ${res.statusText}`);
        this.toggleError();
      }
    });
  }

  // bucket list
  fetchBucketList = () => {
    fetch("https://challenge.3fs.si/storage/buckets",
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.state.auth
            }
    })
    .then(res => {
      if (res.ok) {res.json().then(data=>this.setState({ buckets: data.buckets })) } else {
        this.setErrorMsg(res.status,res.statusText,'App.js:121');
        console.log(`Error (${res.status}) on fetch BucketList, server response: ${res.statusText}`);
        this.toggleError();
      }
    });

  }

  // fetch Locations
  fetchLocations = () => {
    fetch("https://challenge.3fs.si/storage/locations",
          {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.state.auth
    }})
    .then(res =>{
      if (res.ok) {res.json().then(data=> this.setState({ locations: data.locations }))} else {
        console.log(`Error (${res.status}) on fetch Locations, server response: ${res.statusText}`);
        this.setErrorMsg(res.status,res.statusText,'App.js:141');
        this.toggleError();
      }
    });
  }


  // fetch object lists
  fetchObjects = (id) => {
    fetch(`https://challenge.3fs.si/storage/buckets/${id}/objects`, 
          {
              method: "GET",
              headers: {
                      'Content-Type': 'application/json',
                      'Authorization': this.state.auth
                      }
          })
    .then(res => {
      if (res.ok) { res.json().then(data=>this.setState({ objects: data.objects })) } else {
        this.setErrorMsg(res.status,res.statusText,'App.js:160');
        console.log(`Error (${res.status}) on fetch Objects, server response: ${res.statusText}`);
        this.toggleError();
      }
    });    
  }


// ERROR HANDLING

/*
I encountered frequent (500) Internal server error messages and decided to implement the error message for the user.
The errors are also console logged.

*/

// Open notification on fetch error
toggleError = () => {
  this.setState({errToggle: !this.state.errToggle})
}

// Clear the Error message
clearErrorMsg = () => {
  let err = { status: 0, message: '', component: ''} 
  this.setState({ errMsg: err });
}

// Set the error message when the modal window opens
setErrorMsg = (status,text,comp) => {
  let err = { status: status, message: text, component: comp }
  this.setState({ errMsg: err });
}


 // MOUNTING AND UPDATING:

 /*
        I used getSnapshotBeforeUpdate because the prevState in componentDidUpdate returned and empty object ({ })
        which set off an infinite loop of state updates.

 */
  getSnapshotBeforeUpdate(prevProps,prevState) { // prevState returns correctly
      if(prevState !== null) {
        return prevState.auth;
      }
      return null;
  }

  componentDidUpdate(prevState,prevProps,snapshot) { // prevState returns an empty object, that's why snapshot is used
    if (snapshot !== null && snapshot !== this.state.auth) {

      this.fetchBucketList();
      this.fetchLocations();
      this.toggleLogin();
    }
  }

  // Check if user already logged in
  componentDidMount() {
    let ls = localStorage.getItem('userKey');
    if (ls !== null) {
      this.setState({ auth: ls});
      } 
  }



  render() {
    return (
      <>
        <Header goHome={this.goHome}/>
        {!this.state.login && <Secrets
                                    handleLogin={this.handleLogin}
                                    fetchBucketList={this.fetchBucketList}
                                    fetchLocations={this.fetchLocations}/>}
        <div className="width-90"><h2>{(!this.state.bucket) ? 'Bucket list' : this.state.bucket.name }</h2></div>
        {(this.state.login && this.state.bucketlist) && <Bucketlist 
                                    /*States*/
                                    buckets={this.state.buckets}
                                    locations={this.state.locations}
                                    auth={this.state.auth}
                                    /*Functions*/
                                    toggleBucket={this.toggleBucket}
                                    fetchBucketList={this.fetchBucketList}
                                    fetchObjects={this.fetchObjects}
                                    fetchBucket={this.fetchBucket}
                                    /*Errors*/
                                    toggleError={this.toggleError}
                                    setErrorMsg={this.setErrorMsg}
                                    />}
        {(this.state.login && !this.state.bucketlist) && <Bucket
                                    /*States*/
                                    bucket={this.state.bucket}
                                    objects={this.state.objects}
                                    auth={this.state.auth}
                                    /*Functions*/
                                    goHome={this.goHome}
                                    fetchObjects={this.fetchObjects}
                                    fetchBucketList={this.fetchBucketList}
                                    /*Errors*/
                                    toggleError={this.toggleError}
                                    setErrorMsg={this.setErrorMsg}
                                    />}
        {(this.state.errToggle) && <ErrorMessage
                                    toggleError={this.toggleError}
                                    clearErrorMsg={this.clearErrorMsg}
                                    errMsg={this.state.errMsg}
                                    />}
      </>
    );
  }
}

export default App;

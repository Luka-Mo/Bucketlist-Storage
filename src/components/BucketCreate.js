import React, { Component } from 'react';

class BucketCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newBucket: {
                name: '',
                location: ''
                }
            }
        }

    // Form functions

    // Set the value from the name <input>
    handleNameChange = (e) => {
        const newState = {
            name: e.target.value,
            location: this.state.newBucket.location
        }
        this.setState({ newBucket: newState });
    }


    // Set the location based on the <select> value
    handleSelectChange = (e) => { 
        let newState = {
            name: this.state.newBucket.name,
            location: e.target.value
        }
        this.setState({ newBucket: newState })
    }



    // POST request to the API
    addBucket = (e) => { 
        e.preventDefault(); // Prevent default form submit
        let { location, name } = this.state.newBucket;
        
        if(!name || !location) { alert('Name and location are both required fields!'); } else { // If the name is not displayed warn the user

            fetch("https://challenge.3fs.si/storage/buckets", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.props.auth
                    },
                body: JSON.stringify({
                    name: name,
                    location: location
                })})
            .then(res =>{
                    if (res.ok) { this.props.fetchBucketList(); } else {
                        this.props.setErrorMsg(res.status,res.statusText,'BucketCreate.js:56');
                        console.log(`Error (${res.status}) creating a bucket, server says: ${res.statusText}`);
                        this.props.toggleError();
                    }
                });
            this.props.toggleCreate();
        }    
    }
  render() {
    const form = <form onSubmit={this.addBucket}>
                    <div className="row">
                        <div className="col-6">
                        <label>Bucket Name*</label><br />
                        <input type="text" name="name" value={this.state.newBucket.name} onChange={this.handleNameChange}/>      
                        </div>
                        <div className="col-6">
                        <label>Location*</label><br />
                            <select name="locations" onChange={this.handleSelectChange}>
                                <option></option>
                                {this.props.locations.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-left">
                            <button className="btn btn-success">Add Bucket</button>
                        </div>
                    </div>
                </form>;
    const btn = <button onClick={this.props.toggleCreate} className="btn btn-info">CreateBucket</button> // Toggle the Add bucket form button
    return (
    <>
        <div className="width-90 bg-white">
        {(this.props.toggle) ? form : btn}
        </div>
    </>
    )
  }
}

export default BucketCreate

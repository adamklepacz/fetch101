import React from 'react';
import image from '../images/cloud-upload-download-data-transfer.svg';
import Collapsible from './Collapsible';

class App extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoading: true,
        contacts: []
      }
    }

    componentWillMount() {
      localStorage.getItem('contacts') && this.setState({
        contacts: JSON.parse(localStorage.getItem('contacts')),
        isLoading: false
      })
    }

    componentDidMount(){
      // setInterval(this.countTime.bind(this), 1000);
      const dataTime = localStorage.getItem('contactsDate');
      const contactsTime = new Date(parseInt(dataTime));
      const now = new Date();

      const dataAge = (now - contactsTime);
      const tooOld = dataAge >= 10000;
      console.log('Data is ', dataAge, 'ms old.');




      if(tooOld) {
        this.fetchData();
      } else {
        console.log('Using data from localStorage');
      }
    }

    // countTime() {
    //   const prevTime = localStorage.getItem('contactsDate');
    //   const currentTime = Date.now();
    //   const timePassed = currentTime - prevTime;
    //
    //   if(timePassed > 5000) {
    //
    //     this.fetchData();
    //   }
    // }

    fetchData() {
      this.setState({
        isLoading: true,
        contacts: []
      });

      fetch('https://randomuser.me/api/?results=50&nat=pl,uk,de,gb')
        .then(response => response.json())
        .then(parsedJSON => parsedJSON.results.map(user => {
          return (
            {
              name: `${user.name.first} ${user.name.last}`,
              username: `${user.login.username}`,
              email: `${user.email}`,
              location: `${user.location.city}, ${user.location.street}`
            }
          )
        }))
        .then(contacts => this.setState({
          isLoading: false,
          contacts: contacts
        }))
        .catch(error => console.log('Parsing failed', error));
    }

    componentWillUpdate(nextProps, nextState) {
      localStorage.setItem('contacts', JSON.stringify(nextState.contacts));
      localStorage.setItem('contactsDate', Date.now());
    }

    render() {
      const {isLoading, contacts} = this.state;

        return (
            <div>
                <header>
                    <img src={image} />
                    <h1>Fetching Data
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          this.fetchData();
                        }}>Fetch now
                      </button>
                    </h1>
                </header>
                <div className={`content ${isLoading ? 'is-loading' : ''}`}>
                    <div className="">
                        {
                          !isLoading && contacts.length > 0 ? contacts.map((contact, index) => {
                            const {name, username, email, location} = contact;
                            return <Collapsible key={username} title={name}>
                                      <p>{email}<br />{location}</p>
                                   </Collapsible>
                          }) : null
                        }
                    </div>
                    <div className="loader">
                      <div className="icon"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;

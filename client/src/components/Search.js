import React from 'react';
import '../style/Search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import SearchVCRow from './SearchVCRow';
import SearchComRow from './SearchComRow';
import SearchIndsRow from './SearchIndsRow';
import Select from 'react-select';

const options = [
  {value: "VC", label: "VC"},
  {value: "Company", label: "Company"},
  {value: "Industry", label: "Industry"},
];

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchMode: "",
      searchString: "",
      searchResult: [],
      searchMessage: "",
    };

		this.handleSearchStringChange = this.handleSearchStringChange.bind(this);
		this.submitSearch = this.submitSearch.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
  };

  handleSearchStringChange(e) {
		this.setState({
			searchString: e.target.value
		});
    //console.log("Search String updated:" + this.state.searchString);
	};

  submitSearch() {
    //console.log("Search submitted: " +  this.state.searchString);
    if (this.state.searchMode == "VC") {
      this.showVC();
    } else if (this.state.searchMode == "Company") {
      this.showComs();
    } else if (this.state.searchMode == "Industry") {
      this.showInds();
    } else {
      console.log("Illegal search state")
    }
  };


  handleModeChange(e) {
    //console.log("Event value: " + e.value)
    //console.log("Before change:" + this.state.searchMode)
		this.setState({
			searchMode: e.value,
      searchResult : [], //clear search result and search string on mode change
      searchString: "",
      searchMessage: ""
		});
    //console.log("Searching:" + this.state.searchMode)
  }
  // React function that is called when the page load.
  
  componentDidMount() {
    this.setState({
      searchMode: "VC"
    })
  };
  

  /* ---- VC Search ---- */
  showVC() {
    //console.log("Query started: this.state.searchString" );
    fetch("http://localhost:8081/searchVC/" +  this.state.searchString, {
			method: "GET"
		})
			.then(res => res.json())
			.then(vcList => {
				//console.log(companiesList); //displays your JSON object in the console
        const vcDivs = vcList.map((vc, i) =>
        <SearchVCRow
          key={i}
          id={vc.id}
          name={vc.name}
          founded={vc.founded} 
          total={vc.total}
          number={vc.number}
          industry={vc.industry} 
        /> 
        );
        
				this.setState({
					searchResult: vcDivs
				});
        //console.log(this.state.searchResult);
        this.resultStats();
			})
			.catch(err => console.log(err))
  };

  /* ---- Company Search ---- */
  showComs() {
    //console.log("Query started: this.state.searchString" );
    fetch("http://localhost:8081/searchStartup/" +  this.state.searchString, {
      method: "GET"
    })
      .then(res => res.json())
      .then(comList => {
        //console.log(companiesList); //displays your JSON object in the console
        const comDivs = comList.map((com, i) =>
        <SearchComRow
          key={i}
          id={com.id}
          name={com.name}
          founded={com.founded} 
          industry={com.industry} 
          total={com.total}
          number={com.number}
        /> 
        );
        
        this.setState({
          searchResult: comDivs
        });
        //console.log(this.state.searchResult);
        this.resultStats();
      })
      .catch(err => console.log(err))
  };

  /* ---- Industry Search ---- */
  showInds() {
    //console.log("Query started: this.state.searchString" );
    fetch("http://localhost:8081/searchIndustry/" +  this.state.searchString, {
      method: "GET"
    })
      .then(res => res.json())
      .then(comList => {
        //console.log(companiesList); //displays your JSON object in the console
        const comDivs = comList.map((com, i) =>
        <SearchIndsRow
          key={i}
          name={com.name}
          total={com.total}
          number={com.number}
        /> 
        );
        
        this.setState({
          searchResult: comDivs
        });
        //console.log(this.state.searchResult);
        this.resultStats();
      })
      .catch(err => console.log(err))
  };

  /* ---- Display result stats ---- */
  resultStats() {
    var resultSize = this.state.searchResult.length;
    //console.log("Result size: " + resultSize);
    if (resultSize == 0) {
      this.setState ({
        searchMessage: "The search didn't match anything in our database. Please try a different search."
      });  
    } else if (resultSize >= 100) {
      this.setState ({
        searchMessage: "Found more than 100 results. Showing the best matching 100 results."
      });  
    } else {
      //console.log("Result size in else: " + resultSize);
      this.setState ({
        searchMessage: "Found " + resultSize + " results."
      }); 
    }
    //console.log("Search message: " + this.state.searchMessage);
  };

  render() {    
    //console.log("Search mode:" + this.state.searchMode);
    const {selectedMode} = this.state.searchMode;
    if (this.state.searchMode == "VC") {
      return (
        <div className="search">
  
          <PageNavbar active="search" />
          <div className="container VCSearch-container">
            <div className="jumbotron">
              <div className="h3">Search</div>
              <br></br>
              <div className="input-container">
                <input type='text' placeholder="Search..." value={this.state.searchString} onChange={this.handleSearchStringChange} id="searchString" className="search-input"/>
                <button id="submitBtn" className="submit-btn" onClick={this.submitSearch}>Search</button>
              </div>
              <div className = "mode-container">
                Searching for:
                <Select
                value={selectedMode}
                defaultValue={{value: "VC", label: "VC"}}
                onChange={this.handleModeChange}
                options={options}
                />
              </div>
            </div>
            <div className="jumbotron">
              <div className = "message-container">
                <div className = "search-message"> {this.state.searchMessage}</div>
              </div>  
              <div className="header-container">
                <div className="headers">
                  <div className="header"><strong>VC Name</strong></div>
                  <div className="header"><strong>Founded Date</strong></div>
                  <div className="header"><strong>Total Investments</strong></div>
                  <div className="header"><strong>Number of Investments</strong></div>
                  <div className="header"><strong>Top Industry</strong></div>
                </div>
              </div>
              <div className="results-container" id="results">
                {this.state.searchResult}
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (this.state.searchMode == "Company") {
      return (
        <div className="Search">
  
          <PageNavbar active="search" />
          <div className="container VCSearch-container">
            <div className="jumbotron">
              <div className="h3">Search</div>
              <br></br>
              <div className="input-container">
                <input type='text' placeholder="Search..." value={this.state.searchString} onChange={this.handleSearchStringChange} id="searchString" className="search-input"/>
                <button id="submitBtn" className="submit-btn" onClick={this.submitSearch}>Search</button>
              </div>
              <div className = "mode-container">
                <div className = "label">Searching for:</div>
                <Select
                value={selectedMode}
                defaultValue={{value: "VC", label: "VC"}}
                onChange={this.handleModeChange}
                options={options}
                />
              </div>
            </div>
            <div className="jumbotron">
              <div className = "message-container">
                <div className = "search-message"> {this.state.searchMessage}</div>
              </div>  
              <div className="header-container">
                <div className="headers">
                  <div className="header"><strong>Company Name</strong></div>
                  <div className="header"><strong>Founded Date</strong></div>
                  <div className="header"><strong>Industry</strong></div>
                  <div className="header"><strong>Total Funding</strong></div>
                  <div className="header"><strong>Number of Rounds</strong></div>
                </div>
              </div>
                <div className="results-container" id="results">
                  {this.state.searchResult}
                </div>
            </div>
            
          </div>
        </div>
      );
    } else {
      return (
        <div className="Search">
  
          <PageNavbar active="search" />
          <div className="container VCSearch-container">
            <div className="jumbotron">
              <div className="h3">Search</div>
              <br></br>
              <div className="input-container">
                <input type='text' placeholder="Search..." value={this.state.searchString} onChange={this.handleSearchStringChange} id="searchString" className="search-input"/>
                <button id="submitBtn" className="submit-btn" onClick={this.submitSearch}>Search</button>
              </div>
              <div className = "mode-container">
                <div className = "label">Searching for:</div>
                <Select
                value={selectedMode}
                defaultValue={{value: "VC", label: "VC"}}
                onChange={this.handleModeChange}
                options={options}
                />
              </div>
            </div>
            <div className="jumbotron">
              <div className = "message-container">
                <div className = "search-message"> {this.state.searchMessage}</div>
              </div>    
              <div className="header-container">
                <div className="headers">
                  <div className="header"><strong>Industry</strong></div>
                  <div className="header"><strong>Total Investments</strong></div>
                  <div className="header"><strong>Number of Investments</strong></div>
                </div>
              </div>
              <div className="results-container" id="results">
                {this.state.searchResult}
              </div>
            </div>
          </div>
        </div>
      );
    }

  };
};

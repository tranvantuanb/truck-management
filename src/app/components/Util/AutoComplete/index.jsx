import { Fragment } from "react";

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: this.props.value || ""
    };
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value){
        this.setState({userInput: nextProps.value});
      }
  };

  getInputValue() {
    return this.state.userInput
  };

  handleMultipleChoice = (userInput) => {
    let terms = this.state.userInput.split(/,\s*/);
    terms.pop();
    terms.push(userInput);

    return terms.join(", ")
  };

  onChange = (e) => {
    const suggestions = this.props.suggestions;
    let userInput = e.target.value;
    if (this.props.multiple) {
      userInput = userInput.split(/,\s*/).pop();
    }
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      activeIndex: 0,
      filteredSuggestions: filteredSuggestions,
      showSuggestions: true,
      userInput: e.target.value
    });
  };

  onClick = (e) => {
    let userInput = e.target.innerText;
    if (this.props.multiple) {
      userInput = this.handleMultipleChoice(userInput);
    }
    this.setState({
      activeIndex: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: userInput
    });
  };

  onKeyDown = (e) => {
    const activeIndex = this.state.activeIndex;
    const filteredSuggestions = this.state.filteredSuggestions;
    if (e.keyCode === 13) {
      let userInput = filteredSuggestions[activeIndex]

      if (this.props.multiple) {
        userInput = this.handleMultipleChoice(userInput);
      }

      this.setState({
        activeIndex: 0,
        showSuggestions: false,
        userInput: userInput
      });
    }
    else if (e.keyCode === 38) {
      if (activeIndex === 0) {
        return;
      }

      this.setState({ activeIndex: activeIndex - 1 });
    }
    else if (e.keyCode === 40) {
      if (activeIndex + 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeIndex: activeIndex + 1 });
    }
  };

  render() {
    let suggestionsListComponent;
    let state = this.state;
    let fieldName = this.props.fieldName.replace(/\s+/g, '_').toLowerCase();

    if (state.showSuggestions && state.userInput) {
      if (state.filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {state.filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === state.activeIndex) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={index}
                  value={suggestion}
                  onClick={(event) => this.onClick(event)}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return (
      <Fragment>
        <span className="label-input">{this.props.fieldName} {this.props.required ? "*" : ""}</span>
        <input
          className="input"
          name={fieldName}
          type="text"
          onKeyDown={this.onKeyDown}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          value={state.userInput}/>
        {this.props.errors[fieldName] ?
          <span className="error">{this.props.errors[fieldName]}</span> : null}
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

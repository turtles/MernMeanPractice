import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import AuthForm from './AuthForm';
import ErrorList from '../../Reusable/Errors/ErrorList';

import query from '../../../graphql/queries/CurrentUser';
import mutation from '../../../graphql/mutations/LoginUser';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {errors: []};
  }
  componentWillUpdate(nextProps) {
    const { history } = this.props;

    if (!this.props.data.user && nextProps.data.user) {
      history.push('/'); // redirect
    }
  }
  onError(error) {
    this.setState({errors: [error]});
  }
  onSubmit({email, password}) {
    this.props.mutate({
      variables: {email, password},
      refetchQueries: [{ query }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error=>error.message);
      this.setState({ errors });
    });
  }
  render() {
    return (
      <div>
        <h1>Log in</h1>
        <AuthForm
          onSubmit={this.onSubmit.bind(this)}
          onError={this.onError.bind(this)}
        />
        <ErrorList errors={this.state.errors}/>
      </div>
    );
  }
}

export default graphql(mutation)(
    graphql(query)(
      LoginForm
    )
);

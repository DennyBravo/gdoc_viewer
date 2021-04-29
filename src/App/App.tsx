import React from 'react';
import { gapi } from 'gapi-script';
import { Button, Spinner } from 'mx-ui';
import Time from 'timen';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

import Image from 'assets/logo.svg';

import S from './App.styl';
import * as C from './App.constants';

import { Test1 } from 'Views/Test1/Test1';
import { Test2 } from 'Views/Test2/Test2';

import Tabs from 'UI/Tabs/Tabs';
class App extends React.Component {
  state = {
    isInitialized: false,
    isSignedIn: false,
    isSigningProcess: false,
    error: null,
    activePage: C.PAGE_TEST_1,
  };
  gapiClient = null;
  gapiInstance: any;
  timers = Time.create();

  componentDidMount() {
    // gapi.load('client', () => this.initClient());
    gapi.load('client', () => this.initWithoutGApi());
  }

  componentWillUnmount() {
    this.timers.clear();
  }

  startTimer(time){
    return new Promise((resolve) => {
      this.timers.after(time, resolve);
    });
  }

  async initWithoutGApi() {
    await this.startTimer(2000);

    this.setState({
      isSignedIn: true,
      isInitialized: true
    });
  }

  async initClient() {
    this.gapiClient = await gapi.client.init({
      apiKey: C.REACT_APP_GOOGLE_DRIVE_API_KEY,
      clientId: C.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
      discoveryDocs: C.DISCOVERY_DOCS,
      scope: C.SCOPES
    });

    this.gapiInstance = gapi.auth2.getAuthInstance();
    this.gapiInstance.isSignedIn.listen(isSignedIn => {
      this.setState({ isSignedIn });
    });

    this.setState({
      isSignedIn: this.gapiInstance.isSignedIn.get(),
      isInitialized: true
    });
  }

 async handleAuthClick() {
    this.setState({ isSigningProcess: true });
    await this.startTimer(2000);
    this.setState({ 
      isSignedIn: true, 
      isSigningProcess: false 
    });
  }

  async handleSignoutClick() {
    // this.gapiInstance.signOut();
    this.setState({ 
      isSignedIn: false,
      isSigningProcess: true 
    });
    await this.startTimer(1000);
    this.setState({ 
      error: false, 
      isSignedIn: false,
      isSigningProcess: false 
    });
  }

  handleError(error) {
    this.setState({ error });
  }

  renderTabs(){
    const { activePage } = this.state;

    const items = [
      { 
        id: C.PAGE_TEST_1, 
        title: 'Test Data 1',
        link: '/data1'
      },
      { 
        id: C.PAGE_TEST_2, 
        title: 'Test Data 2',
        link: '/data2'
      },
    ];

    return (
      <Tabs
        className={S.tabs}
        items={items}
        active={activePage}
        onChange={(e, val) => this.setState({ activePage: val })}
      />
    )
  }

  renderAuth() {
    return (
      <div className={S.authContainer}>
        <Image alt="Logo" className={S.logo} />
        <Button onClick={() => this.handleAuthClick()} size="m" variant="primary">Authorize</Button>
      </div>
    );
  }

  renderError() {
    const { error } = this.state;

    return (
      <div className={S.authContainer}>
          <Image alt="Logo" className={S.logo} />
          <div className={[S.errorStatus, S.bold].join(' ')}>{error?.status}</div>
          <div className={S.errorMessage}>{error?.message}</div>
          <Button onClick={() => this.handleSignoutClick()} size="m" variant="default">
            <Link to="/">Logout</Link>
          </Button>
      </div>
    );
  }

  render() {
    const { isSignedIn, isSigningProcess, isInitialized, error } = this.state;
    const viewParams = {
      handleSignoutClick: () => this.handleSignoutClick(),
      handleError: error => this.handleError(error)
    };
    const showAuthButton = !isSignedIn && !isSigningProcess;
    const showFileView = isSignedIn && !error;

    return isInitialized &&
      <Router>
        <div className={S.App}>
          {isSigningProcess && <Spinner className={S.spinner} size="3xl" />}
          {showAuthButton && this.renderAuth()}
          {error && this.renderError()}
          {showFileView && (
            <>
              {this.renderTabs()}
              <Switch>
                <Route exact path="/">
                  {isSignedIn ? <Redirect to="/data1" /> : null}
                </Route>
                <Route path="/data1">
                  <Test1 key="test1" {...viewParams} />
                </Route>
                <Route path="/data2">
                  <Test2 key="test2" {...viewParams} />
                </Route>
              </Switch>
              <div className={S.filtersPanel}></div>
            </>
          )}
        </div>
      </Router>;
  };
}

export default App;

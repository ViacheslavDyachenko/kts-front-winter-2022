import logo from './logo.svg';
import './App.css';
import "./root/root";
import GitHubStore from './store/GitHubStore';
import React, { SetStateAction } from 'react';
import { ApiResp } from './store/GitHubStore/types';
import { StatusHTTP } from './shared/store/ApiStore/types';

let val: string = 'Получить access token';

function App() {

  const [user, setUser] = React.useState<ApiResp<{}>>({success: false, data: {}, status: StatusHTTP.BAD_STATUS});
  const [loaded, setloaded] = React.useState(false);

  const client_id = 'ebac1c599a2b6c661bbb';
  const gitHubStore = new GitHubStore();
  React.useEffect(() => {
    gitHubStore.createRepos({
      organizationName: 'ktsstudio',
      name: 'newRepo',
      description: 'description',
      private: false}).then((response) => {
        setUser(() => ({ success: response.success, data: response.data, status: response.status }));
        setloaded(true)
      });
  }, [loaded])
  
  const authorize_uri = 'https://github.com/login/oauth/authorize';
  const redirect_uri = 'http://localhost:3000/oauth/redirect';

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href={`${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`}
          rel="noopener noreferrer"
        >
          {val}
        </a>
      </header>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import "@root/root";

let val: string = 'Привет';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://ru.reactjs.org/"
          rel="noopener noreferrer"
        >
          {val}
        </a>
      </header>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';

import {useEffect, useState } from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTweets} from "./graphql/queries";
import {createTweet} from "./graphql/mutations";

function App() {
  const [formData, setFormData] = useState({
    author: "",
    text:"",
  });
  const onChange = (event)=>{
    const{
      target: {name, value},
    } = event;
    setFormData((prev)=>({...prev, [name]:value}));
  };
  const [tweets, setTweets] = useState([]);
  const fetchTweets = async () => {
    const request = await API.graphql(graphqlOperation(listTweets));
    setTweets(request.data.listTweets.items);
  };
  useEffect(()=>{
    fetchTweets()
  },[]);
  return (
    <main className='container'>
      <h1>Tweetify!</h1>
      <section>
        <h3>Tweet something!</h3>
        <form>
          <input type="text" name="author" placeholder='What is your name?' required onChange={onChange} value={formData.author}/>
          <textarea name='text' required placeholder='What is on your mind?'></textarea>
          <button></button>
        </form>
      </section>
      <hr/>
      <section>
        <h3>Timeline</h3>
        <div>
          {tweets.map((tweet)=>(
            <article key={tweet.id}>
              <hgroup>
                <h4>{tweet.text}</h4>
                <h5>{tweet.author}</h5>
              </hgroup>
            </article>
          ))}
        </div>
      </section>
    </main>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

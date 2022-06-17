import logo from './logo.svg';
import './App.css';

import {useEffect, useState } from "react";
import {API, graphqlOperation} from "aws-amplify";
import {listTweets} from "./graphql/queries";
import {createTweet} from "./graphql/mutations";
import {onCreateTweet} from "./graphql/subscriptions";

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
  
  const realtimeTweets = ()=>{
    API.graphql(graphqlOperation(onCreateTweet)).subscribe({
      next: ({value:{data}})=>
      setTweets((prev)=> [{...data.onCreateTweet},...prev]),
    });
  };

  useEffect(()=>{
    fetchTweets();
    realtimeTweets();
  },[]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await API.graphql(graphqlOperation(createTweet,{input:formData}));
    setFormData((prev)=>({...prev, text:""}));
  }
  return (
    <main className='container'>
      <h1>Tweetify!</h1>
      <section>
        <h3>Tweet something!</h3>
        <form onSubmit={onSubmit}>
          <input type="text" name="author" placeholder='What is your name?' required onChange={onChange} value={formData.author}/>
          <textarea name='text' required placeholder='What is on your mind?' onChange={onChange} value={formData.text}></textarea>
          <button>Post</button>
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
  );
}

export default App;

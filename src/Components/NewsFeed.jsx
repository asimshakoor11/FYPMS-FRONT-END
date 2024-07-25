import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles/NewsFeed.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  let LoggedinUserName = localStorage.getItem("loggedInUserName");
  const userRole = localStorage.getItem("userRole");

  if (!LoggedinUserName) {
    LoggedinUserName = "FYP Committee";
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/posts');
        const response = await axios.get('https://fypms-back-end.vercel.app/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  const handleShareClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      title,
      description,
      name: LoggedinUserName,
    };

    try {
      // const response = await axios.post('http://localhost:5000/posts', newPost);
      const response = await axios.post('https://fypms-back-end.vercel.app/posts', newPost);
      setPosts([response.data, ...posts]);
      setTitle('');
      setDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to submit post', error);
    }
  };

  return (
    <div className="news-feed">
      <div className="header">
        <h2 className='font-bold text-3xl '>Posts</h2>
        {userRole !== "Student" && (
          <button onClick={handleShareClick} className='p-3 bg-primarycolor hover:bg-primarycolorhover text-white'>Share in Feed</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="post-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="post">
              <h3 className='font-semibold'>{post.title}</h3>
              <p className='text-sm'>{post.description}</p>
              <div className="post-info flex justify-between">
                <span>Posted by: {post.name}</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;

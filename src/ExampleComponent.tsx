// src/ExampleComponent.js
import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

const fetchPosts = async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

const ExampleComponent = () => {
  const { data: posts, isLoading, error } = useQuery("posts", fetchPosts);

  if (isLoading) return "Carregando...";
  if (error) return <p>Erro ao carregar os posts: </p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleComponent;

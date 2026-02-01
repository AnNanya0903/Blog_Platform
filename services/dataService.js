export const getPosts = async () => {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error('Failed to fetch posts');
  return await response.json();
};

export const getPostById = async (id) => {
  const response = await fetch(`/api/posts/${id}`);
  if (!response.ok) throw new Error('Post not found');
  return await response.json();
};

export const createPost = async (post) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!response.ok) throw new Error('Failed to create post');
  return await response.json();
};

export const updatePost = async (id, updatedData) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!response.ok) throw new Error('Failed to update post');
  return await response.json();
};

export const deletePost = async (id) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete post');
};

export const addComment = async (postId, content, author) => {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author })
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
};


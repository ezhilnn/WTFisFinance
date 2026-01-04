// import { api } from '../../../services/api';
// import type {
//     Blog,
//     Tag,
//     CreateBlogRequest,
//     UpdateBlogRequest,
// } from '../types/blog.types';
// import type { PaginatedResponse } from '../../../types/common.types';

// /**
//  * Blog Service
//  * Handles all blog-related API calls
//  */

// // Get all published blogs (paginated)
// export const getPublishedBlogs = async (
//   page: number = 1,
//   limit: number = 10
// ): Promise<PaginatedResponse<Blog>> => {
//   const response = await api.get<PaginatedResponse<Blog>>('/blogs/published', {
//     page,
//     limit,
//   });

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to fetch blogs');
//   }

//   return response.data;
// };

// // Get blog by slug
// export const getBlogBySlug = async (slug: string): Promise<Blog> => {
//   const response = await api.get<Blog>(`/blogs/slug/${slug}`);

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to fetch blog');
//   }

//   return response.data;
// };

// // Get all blogs (admin only - includes unpublished)
// export const getAllBlogs = async (
//   page: number = 1,
//   limit: number = 10
// ): Promise<PaginatedResponse<Blog>> => {
//   const response = await api.get<PaginatedResponse<Blog>>('/blogs', {
//     page,
//     limit,
//   });

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to fetch blogs');
//   }

//   return response.data;
// };

// // Create blog (admin only)
// export const createBlog = async (data: CreateBlogRequest): Promise<Blog> => {
//   const response = await api.post<Blog>('/blogs', data);

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to create blog');
//   }

//   return response.data;
// };

// // Update blog (admin only)
// export const updateBlog = async (data: UpdateBlogRequest): Promise<Blog> => {
//   const { id, ...updateData } = data;
//   const response = await api.put<Blog>(`/blogs/${id}`, updateData);

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to update blog');
//   }

//   return response.data;
// };

// // Delete blog (admin only)
// export const deleteBlog = async (id: string): Promise<void> => {
//   const response = await api.delete(`/blogs/${id}`);

//   if (!response.success) {
//     throw new Error(response.error || 'Failed to delete blog');
//   }
// };

// // Get all tags
// export const getAllTags = async (): Promise<Tag[]> => {
//   const response = await api.get<Tag[]>('/tags');

//   if (!response.success || !response.data) {
//     throw new Error(response.error || 'Failed to fetch tags');
//   }

//   return response.data;
// };

// // Record view
// export const recordView = async (blogId: string): Promise<void> => {
//   await api.post('/views/view', { blogId });
// };

// // Record engaged read
// export const recordEngagedRead = async (blogId: string): Promise<void> => {
//   await api.post('/views/engaged', { blogId });
// };
import { api } from '../../../services/api';
import type {
    Blog,
    Tag,
    CreateBlogRequest,
    UpdateBlogRequest,
} from '../types/blog.types';
import type { PaginatedResponse } from '../../../types/common.types';

/**
 * Blog Service
 * Handles all blog-related API calls
 */

// Get all published blogs (paginated)
export const getPublishedBlogs = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Blog>> => {
  const response = await api.get<{ blogs: Blog[]; pagination: any }>('/blogs/published', {
    page,
    limit,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch blogs');
  }

  // Transform to expected format
  return {
    data: response.data.blogs,  // Extract blogs array
    pagination: response.data.pagination,
  };
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await api.get<Blog>(`/blogs/slug/${slug}`);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch blog');
  }

  return response.data;
};

// Get all blogs (admin only - includes unpublished)
export const getAllBlogs = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Blog>> => {
  const response = await api.get<{ blogs: Blog[]; pagination: any }>('/blogs', {
    page,
    limit,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch blogs');
  }

  // Transform to expected format
  return {
    data: response.data.blogs,  // Extract blogs array
    pagination: response.data.pagination,
  };
};

// Create blog (admin only)
export const createBlog = async (data: CreateBlogRequest): Promise<Blog> => {
  const response = await api.post<Blog>('/blogs', data);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to create blog');
  }

  return response.data;
};

// Update blog (admin only)
export const updateBlog = async (data: UpdateBlogRequest): Promise<Blog> => {
  const { id, ...updateData } = data;
  const response = await api.put<Blog>(`/blogs/${id}`, updateData);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to update blog');
  }

  return response.data;
};

// Delete blog (admin only)
export const deleteBlog = async (id: string): Promise<void> => {
  const response = await api.delete(`/blogs/${id}`);

  if (!response.success) {
    throw new Error(response.error || 'Failed to delete blog');
  }
};

// Get all tags
export const getAllTags = async (): Promise<Tag[]> => {
  const response = await api.get<Tag[]>('/tags');

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch tags');
  }

  return response.data;
};

// Record view
export const recordView = async (blogId: string): Promise<void> => {
  await api.post('/views/view', { blogId });
};

// Record engaged read
export const recordEngagedRead = async (blogId: string): Promise<void> => {
  await api.post('/views/engaged', { blogId });
};
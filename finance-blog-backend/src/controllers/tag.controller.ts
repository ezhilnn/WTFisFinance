import { Request, Response } from 'express';
import * as tagModel from '../models/tag.model';
import { sendSuccess, sendError, notFound } from '../utils/response.util';

// Get all tags (Public)
export const getAllTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await tagModel.getAllTags();
    sendSuccess(res, tags);
  } catch (error) {
    console.error('Get all tags error:', error);
    sendError(res, 'Failed to fetch tags');
  }
};

// Get tag by ID (Public)
export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tag = await tagModel.getTagById(id);
    
    if (!tag) {
      notFound(res, 'Tag');
      return;
    }
    
    sendSuccess(res, tag);
  } catch (error) {
    console.error('Get tag by ID error:', error);
    sendError(res, 'Failed to fetch tag');
  }
};

// Get tag by slug (Public)
export const getTagBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const tag = await tagModel.getTagBySlug(slug);
    
    if (!tag) {
      notFound(res, 'Tag');
      return;
    }
    
    sendSuccess(res, tag);
  } catch (error) {
    console.error('Get tag by slug error:', error);
    sendError(res, 'Failed to fetch tag');
  }
};

// Create tag (Admin only - called internally when creating blogs)
export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      sendError(res, 'Tag name is required', 400);
      return;
    }
    
    const tag = await tagModel.createTag(name);
    sendSuccess(res, tag, 'Tag created successfully', 201);
  } catch (error) {
    console.error('Create tag error:', error);
    sendError(res, 'Failed to create tag');
  }
};
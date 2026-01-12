// src/features/learn/utils/learnData.utils.ts

import categoriesData from '../../../data/learn/categories.json';
import productsData from '../../../data/learn/products.json';
import lessonsIndexData from '../../../data/learn/lessons-index.json';
import quizzesData from '../../../data/learn/quizzes.json';
const lessonModules = import.meta.glob('../../../data/learn/**/*.json');

import type {
  Category,
  Product,
  Lesson,
  LessonIndex,
  Quiz,
  SubAnchorWithLessons,
  AnchorWithContent,
  ProductWithContent,
} from '../types/learn.types';

// Cache for loaded lesson content
const contentCache: Map<string, any[]> = new Map();

/**
 * Load lesson content dynamically from separate JSON files
 */
const loadLessonContent = async (contentPath: string): Promise<any[]> => {
  if (contentCache.has(contentPath)) {
    return contentCache.get(contentPath)!;
  }
  const fullPath = `../../../data/learn/${contentPath}`;

  const loader = lessonModules[fullPath];
  if (!loader) {
    console.error(`Lesson file not found: ${fullPath}`);
    return [];
  }

  try {
    const module : any = await loader();
    const content = module.default;
    contentCache.set(contentPath, content);
    return content;
  } catch (error) {
    console.error(`Failed to load lesson content from ${contentPath}:`, error);
    return [];
  }
};

/**
 * Get all categories, sorted by order
 */
export const getCategories = (): Category[] => {
  return [...(categoriesData as Category[])].sort((a, b) => a.order - b.order);
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return (categoriesData as Category[]).find((cat) => cat.slug === slug);
};

/**
 * Get products for a category, sorted by order
 */
export const getProductsByCategory = (categoryId: string): Product[] => {
  return (productsData as Product[])
    .filter((prod) => prod.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Get product by slug within a category
 */
export const getProductBySlug = (
  categorySlug: string,
  productSlug: string
): Product | undefined => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;

  return (productsData as Product[]).find(
    (prod) => prod.categoryId === category.id && prod.slug === productSlug
  );
};

/**
 * Get lesson indexes by product, anchor, and sub-anchor
 */
export const getLessonIndexesBySubAnchor = (
  productId: string,
  subAnchorId: string
): LessonIndex[] => {
  return (lessonsIndexData as LessonIndex[])
    .filter(
      (lesson) =>
        lesson.productId === productId &&
        lesson.subAnchorId === subAnchorId &&
        lesson.isLatest
    )
    .sort((a, b) => a.orderInSubAnchor - b.orderInSubAnchor);
};

/**
 * Load full lesson with content
 */
export const loadLesson = async (lessonIndex: LessonIndex): Promise<Lesson> => {
  const contentJSON = await loadLessonContent(lessonIndex.contentPath);
console.log(contentCache);
console.log(contentJSON);
  return {
    id: lessonIndex.id,
    productId: lessonIndex.productId,
    anchorId: lessonIndex.anchorId,
    subAnchorId: lessonIndex.subAnchorId,
    title: lessonIndex.title,
    slug: lessonIndex.slug,
    contentJSON,
    orderInSubAnchor: lessonIndex.orderInSubAnchor,
    version: lessonIndex.version,
    isLatest: lessonIndex.isLatest,
  };
};

/**
 * Get quiz for a product
 */
export const getQuizByProduct = (productId: string): Quiz | undefined => {
  return (quizzesData as Quiz[]).find((quiz) => quiz.productId === productId);
};

/**
 * Load sub-anchor with its lessons (no quiz here)
 */
export const loadSubAnchorWithLessons = async (
  productId: string,
  subAnchorId: string,
  subAnchor: any
): Promise<SubAnchorWithLessons> => {
  const lessonIndexes = getLessonIndexesBySubAnchor(productId, subAnchorId);
  const lessons = await Promise.all(lessonIndexes.map((idx) => loadLesson(idx)));

  return {
    ...subAnchor,
    lessons,
  };
};

/**
 * Load anchor with all its sub-anchors and lessons
 */
export const loadAnchorWithContent = async (
  productId: string,
  anchor: any
): Promise<AnchorWithContent> => {
  const subAnchorsWithLessons = await Promise.all(
    anchor.subAnchors.map((subAnchor: any) =>
      loadSubAnchorWithLessons(productId, subAnchor.id, subAnchor)
    )
  );

  return {
    ...anchor,
    subAnchorsWithLessons,
  };
};

/**
 * Get product with all anchors, sub-anchors, lessons, and quiz loaded
 */
export const getProductWithContent = async (
  categorySlug: string,
  productSlug: string
): Promise<ProductWithContent | undefined> => {
  const product = getProductBySlug(categorySlug, productSlug);
  if (!product) return undefined;

  const anchorsWithContent = await Promise.all(
    product.anchors.map((anchor) => loadAnchorWithContent(product.id, anchor))
  );

  const quiz = getQuizByProduct(product.id);

  return {
    ...product,
    anchorsWithContent,
    quiz,
  };
};

/**
 * Get lesson by slug within a product and anchor
 */
export const getLessonBySlug = async (
  categorySlug: string,
  productSlug: string,
  anchorSlug: string,
  lessonSlug: string
): Promise<{ lesson: Lesson; product: Product; anchor: any; subAnchor: any } | undefined> => {
  const product = getProductBySlug(categorySlug, productSlug);
  if (!product) return undefined;

  const anchor = product.anchors.find((a) => a.slug === anchorSlug);
  if (!anchor) return undefined;

  const lessonIndex = (lessonsIndexData as LessonIndex[]).find(
    (l) =>
      l.productId === product.id &&
      l.anchorId === anchor.id &&
      l.slug === lessonSlug &&
      l.isLatest
  );

  if (!lessonIndex) return undefined;

  const subAnchor = anchor.subAnchors.find((sa: any) => sa.id === lessonIndex.subAnchorId);
  const lesson = await loadLesson(lessonIndex);

  return { lesson, product, anchor, subAnchor };
};

/**
 * Get all lesson indexes (for admin/listing purposes)
 */
export const getAllLessonIndexes = (): LessonIndex[] => {
  return lessonsIndexData as LessonIndex[];
};
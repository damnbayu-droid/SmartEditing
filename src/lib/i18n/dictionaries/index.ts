import { id } from './id';
import { en } from './en';

export const dictionaries = {
  id,
  en,
};

export type Language = keyof typeof dictionaries;
export type Dictionary = typeof id;

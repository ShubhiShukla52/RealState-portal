import { PropertySearchFilters } from './search';

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertySearchFilters;
  createdAt: string;
  resultCount: number;
}

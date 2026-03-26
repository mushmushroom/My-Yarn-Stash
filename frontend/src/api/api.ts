import { API_ENDPOINTS } from '@/lib/constants';
import http from './http';
import type { Brand, ProjectItem, SkeinItem, SkeinCreateData, SkeinSuggestion, ProjectFormData } from '@/lib/types';

export class Api {
  async getBrands(): Promise<Brand[]> {
    const response = await http.get(API_ENDPOINTS.BRANDS);
    return response.data;
  }

  async getYardageUnits(): Promise<string[]> {
    const response = await http.get(API_ENDPOINTS.YARDAGE_UNITS);
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await http.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  }

  async getProjects(): Promise<ProjectItem[]> {
    const response = await http.get(API_ENDPOINTS.PROJECTS);
    return response.data;
  }

  async createProject(data: ProjectFormData) {
    const response = await http.post(API_ENDPOINTS.PROJECTS, data);
    return response.data;
  }

  async updateProject(id: number, data: ProjectFormData): Promise<ProjectItem> {
    const response = await http.patch(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
    return response.data;
  }

  async deleteProject(id: number) {
    await http.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  }

  async getSkeins(query: string): Promise<Record<string, Record<string, SkeinItem[]>>> {
    const response = await http.get(`${API_ENDPOINTS.SKEINS}${query}`);
    return response.data;
  }

  async getSkeinNames(): Promise<SkeinSuggestion[]> {
    const response = await http.get(`${API_ENDPOINTS.SKEINS}/names`);
    return response.data;
  }

  async createSkein(data: SkeinCreateData): Promise<SkeinItem> {
    const response = await http.post(API_ENDPOINTS.SKEINS, data);
    return response.data;
  }

  async updateSkein(id: number, data: SkeinCreateData): Promise<SkeinItem> {
    const response = await http.patch(`${API_ENDPOINTS.SKEINS}/${id}`, data);
    return response.data;
  }

  async deleteSkein(id: number) {
    await http.delete(`${API_ENDPOINTS.SKEINS}/${id}`);
  }

  async getFibers(): Promise<string[]> {
    const response = await http.get(API_ENDPOINTS.FIBERS);
    return response.data;
  }
}

export const api = new Api();

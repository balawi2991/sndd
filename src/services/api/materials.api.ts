import { apiClient, ApiResponse } from './client';

export interface TrainingMaterial {
  id: string;
  userId: string;
  type: 'file' | 'link' | 'text';
  title: string;
  content?: string;
  url?: string;
  filePath?: string;
  indexedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  type: 'file' | 'link' | 'text';
  title: string;
  content?: string;
  url?: string;
}

export interface MaterialsList {
  materials: TrainingMaterial[];
  total: number;
}

class MaterialsAPI {
  /**
   * List all training materials
   */
  async listMaterials(): Promise<ApiResponse<MaterialsList>> {
    return apiClient.get<MaterialsList>('/materials');
  }

  /**
   * Get a specific material
   */
  async getMaterial(id: string): Promise<ApiResponse<TrainingMaterial>> {
    return apiClient.get<TrainingMaterial>(`/materials/${id}`);
  }

  /**
   * Add new training material
   */
  async addMaterial(data: CreateMaterialRequest): Promise<ApiResponse<TrainingMaterial>> {
    return apiClient.post<TrainingMaterial>('/materials', data);
  }

  /**
   * Update training material
   */
  async updateMaterial(
    id: string,
    data: Partial<CreateMaterialRequest>
  ): Promise<ApiResponse<TrainingMaterial>> {
    return apiClient.patch<TrainingMaterial>(`/materials/${id}`, data);
  }

  /**
   * Delete training material
   */
  async deleteMaterial(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/materials/${id}`);
  }

  /**
   * Upload file
   */
  async uploadFile(file: File): Promise<ApiResponse<TrainingMaterial>> {
    const formData = new FormData();
    formData.append('file', file);

    // TODO: Implement file upload with multipart/form-data
    // For now, return error
    return {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'File upload not yet implemented'
      }
    };
  }
}

export const materialsAPI = new MaterialsAPI();

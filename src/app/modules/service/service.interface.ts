export interface IService {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;  
  location: string;
  rating: number;
  categoryId: string;
  technicianId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
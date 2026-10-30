import { apiClient } from "../../../../shared/infrastructure/apiClient";
import { KaryawanDTO } from "../dtos/KaryawanDTO";

export class KaryawanApiService {
  private readonly baseUrl = "/v1/karyawan";

  async fetchAllKaryawan(): Promise<KaryawanDTO[]> {
    const response = await apiClient.get<KaryawanDTO[]>(this.baseUrl);
    return response.data;
  }
}
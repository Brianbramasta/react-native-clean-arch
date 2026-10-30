import { IKaryawanRepository } from "../../domain/repositories/KaryawanRepository.interface";
import { Karyawan } from "../../domain/entities/Karyawan";
import { KaryawanDTO } from "../dtos/KaryawanDTO";
import { KaryawanMapper } from "../mappers/KaryawanMapper";
import { apiClient } from "../../../../shared/infrastructure/apiClient";

const MOCK_DATA: KaryawanDTO[] = [
  {
    id_karyawan: 1,
    nama_lengkap: "Ahmad Rizky Pratama",
    jabatan_code: "MGR",
    created_at: "2023-01-15T10:00:00.000Z",
  },
  {
    id_karyawan: 2,
    nama_lengkap: "Siti Aminah",
    jabatan_code: "STF",
    created_at: "2023-03-20T08:30:00.000Z",
  },
  {
    id_karyawan: 3,
    nama_lengkap: "Budi Santoso",
    jabatan_code: "STF",
    created_at: "2024-06-10T14:15:00.000Z",
  },
  {
    id_karyawan: 4,
    nama_lengkap: "Dewi Lestari",
    jabatan_code: "MGR",
    created_at: "2022-11-05T09:00:00.000Z",
  },
  {
    id_karyawan: 5,
    nama_lengkap: "Andi Wijaya",
    jabatan_code: "STF",
    created_at: "2024-01-18T11:45:00.000Z",
  },
  {
    id_karyawan: 6,
    nama_lengkap: "Sara Wijaya Putri",
    jabatan_code: "STF",
    created_at: "2023-07-25T16:20:00.000Z",
  },
  {
    id_karyawan: 7,
    nama_lengkap: "Hendra Kurniawan",
    jabatan_code: "MGR",
    created_at: "2024-09-01T08:00:00.000Z",
  },
  {
    id_karyawan: 8,
    nama_lengkap: "Lina Maulani",
    jabatan_code: "STF",
    created_at: "2023-05-14T13:30:00.000Z",
  },
];

export class KaryawanRepositoryImpl implements IKaryawanRepository {
  async getAllKaryawan(): Promise<Karyawan[]> {
    try {
      const response = await apiClient.get<KaryawanDTO[]>("/v1/karyawan");
      return response.data.map(KaryawanMapper.toEntity);
    } catch {
      const mockEntities = MOCK_DATA.map(KaryawanMapper.toEntity);
      return mockEntities.sort(
        (a, b) => b.joinDate.getTime() - a.joinDate.getTime()
      );
    }
  }
}
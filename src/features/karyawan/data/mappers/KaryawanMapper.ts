import { KaryawanDTO } from "../dtos/KaryawanDTO";
import { Karyawan } from "../../domain/entities/Karyawan";

export class KaryawanMapper {
  static toEntity(dto: KaryawanDTO): Karyawan {
    return {
      id: dto.id_karyawan.toString(),
      fullName: dto.nama_lengkap,
      role: dto.jabatan_code === "MGR" ? "Manager" : "Staff",
      joinDate: new Date(dto.created_at),
    };
  }
}
import { Karyawan } from "../entities/Karyawan";

export interface IKaryawanRepository {
  getAllKaryawan(): Promise<Karyawan[]>;
}
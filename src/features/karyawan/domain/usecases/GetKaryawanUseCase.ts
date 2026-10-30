import { IKaryawanRepository } from "../repositories/KaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class GetKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(): Promise<Karyawan[]> {
    const data = await this.karyawanRepo.getAllKaryawan();
    return data.sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
  }
}
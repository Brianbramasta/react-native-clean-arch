import { KaryawanRepositoryImpl } from "../data/repositories/KaryawanRepositoryImpl";
import { GetKaryawanUseCase } from "../domain/usecases/GetKaryawanUseCase";

const karyawanRepository = new KaryawanRepositoryImpl();

export const getKaryawanUseCase = new GetKaryawanUseCase(karyawanRepository);
# 🏛️ Mobile Feature-Based Clean Architecture (React Native)

Dokumen ini merupakan spesifikasi standar fungsi dari masing-masing folder dan file berdasarkan blueprint **Feature-Based Clean Architecture** untuk mobile. Panduan ini dirancang lengkap dengan contoh kode konkret menggunakan TypeScript, Axios, dan TanStack Query.

Kita akan menggunakan contoh studi kasus fitur **Karyawan**.

# 📂 Struktur Folder Fitur `karyawan/` di React Native

text

```
src/
├── shared/                       # 🌐 Komponen global (Shared UI Kit, Api Client Axios)
│   ├── components/               # Button.tsx, Input.tsx, dll.
│   └── infrastructure/
│       └── apiClient.ts          # Instance Axios global untuk fetch ke Express
│
└── features/
    └── karyawan/                 # 📦 Feature: Karyawan
        ├── index.ts              # 🚪 Feature Public API (Penjaga gawang)
        │
        ├── domain/               # 🧠 Domain Layer - PURE TS (Otak bisnis murni)
        │   ├── entities/         # Karyawan.ts
        │   ├── repositories/     # IKaryawanRepository.interface.ts
        │   └── usecases/         # GetKaryawanUseCase.ts
        │
        ├── data/                 # 💾 Data Layer (Urusan Axios & mapping API)
        │   ├── dtos/             # KaryawanDTO.ts (Sesuai JSON response Express)
        │   ├── mappers/          # KaryawanMapper.ts
	        ├── services/         # KaryawanApiService.ts -> (Murni tempat fungsi Axios/Hit Database) 
	        └── repositories/     # KaryawanRepositoryImpl.ts -> (Memanggil ApiService + Mapper)
        │
        ├── di/                   # 🔌 DI Layer (Perakit dependensi)
        │   └── container.ts      # Instansiasi UseCase siap pakai
        │
        └── presentation/         # 🎨 Presentation Layer (Urusan Layar Mobile)
            ├── screens/          # KaryawanScreen.tsx (Halaman Utama)
            ├── components/       # KaryawanCard.tsx (Komponen kecil khusus karyawan)
            ├── hooks/            # useKaryawanQuery.ts (TanStack Query)
            └── store/            # useKaryawanStore.ts (Zustand untuk local state UI)
```

Gunakan kode dengan hati-hati.

---

---

## 🧠 1. Domain Layer (`domain/`)

Layer ini adalah **otak dari bisnis Anda**. Layer ini mutakhir, suci, dan **tidak boleh mengimport apa pun dari komponen UI React Native (seperti View, Text, StyleSheet) atau library luar** (seperti Axios atau TanStack Query). Hanya berisi TypeScript murni.

### 📁 `domain/entities/Karyawan.ts`

- **Fungsi:** Mendefinisikan struktur data murni yang diolah oleh logika bisnis dan digunakan oleh komponen UI.
- **Contoh Isi:**

```typescript
export interface Karyawan {
  id: string;
  fullName: string;
  role: string;
  joinDate: Date; // Menggunakan objek Date asli untuk kemudahan formatting di UI Mobile
}
```

### 📁 `domain/repositories/KaryawanRepository.interface.ts`

- **Fungsi:** Membuat *kontrak* atau janji tentang apa saja aksi data yang bisa dilakukan. Domain tidak peduli datanya diambil dari REST API Express, GraphQL, atau Mock Data lokal.
- **Contoh Isi:**

```typescript
import { Karyawan } from "../entities/Karyawan";

export interface IKaryawanRepository {
  getAllKaryawan(): Promise<Karyawan[]>;
}
```

### 📁 `domain/usecases/GetKaryawanUseCase.ts`

- **Fungsi:** Berisi aturan bisnis (*business logic*). Menggunakan prinsip *Dependency Inversion* dengan menerima repository lewat *constructor/parameter*.
- **Contoh Isi:**

```typescript
import { IKaryawanRepository } from "../repositories/KaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class GetKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(): Promise<Karyawan[]> {
    // Di sini Anda bisa menaruh business logic tambahan, misal filter otomatis atau sorting
    const data = await this.karyawanRepo.getAllKaryawan();
    return data.sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
  }
}
```

---

## 💾 2. Data Layer (`data/`)

Layer ini bertanggung jawab mengambil data mentah dari Network API/Infrastruktur, menyelaraskannya, dan mengimplementasikan kontrak dari Domain.

### 📁 `data/dtos/KaryawanDTO.ts`

- **Fungsi:** *Data Transfer Object*. Meniru persis struktur JSON data kotor/asli yang dikirim oleh backend Express.js (biasanya masih mengikuti format database).
- **Contoh Isi:**

```typescript
export interface KaryawanDTO {
  id_karyawan: number;
  nama_lengkap: string;
  jabatan_code: string;
  created_at: string; // Masih berupa string ISO tanggal dari response API
}
```

### 📁 `data/mappers/KaryawanMapper.ts`

- **Fungsi:** Mengubah data kotor API `KaryawanDTO` menjadi data bersih `Karyawan` (Entity Domain) yang siap dipakai oleh layar dan komponen UI Mobile.
- **Contoh Isi:**

```typescript
import { KaryawanDTO } from "../dtos/KaryawanDTO";
import { Karyawan } from "../../domain/entities/Karyawan";

export class KaryawanMapper {
  static toEntity(dto: KaryawanDTO): Karyawan {
    return {
      id: dto.id_karyawan.toString(),
      fullName: dto.nama_lengkap,
      role: dto.jabatan_code === "MGR" ? "Manager" : "Staff", // Transformasi data bisnis
      joinDate: new Date(dto.created_at), // String diubah jadi Objek Date asli
    };
  }
}
```

### 📁 `data/repositories/KaryawanRepositoryImpl.ts`

- **Fungsi:** Implementasi nyata dari kontrak interface di Domain. Di sini instansiasi HTTP client (`apiClient`) global dipanggil untuk melakukan hit ke API.
- **Contoh Isi:**

```typescript
import { IKaryawanRepository } from "../../domain/repositories/KaryawanRepository.interface";
import { Karyawan } from "../../domain/entities/Karyawan";
import { KaryawanDTO } from "../dtos/KaryawanDTO";
import { KaryawanMapper } from "../mappers/KaryawanMapper";
import { apiClient } from "../../../../shared/infrastructure/apiClient"; // Axios instance global

export class KaryawanRepositoryImpl implements IKaryawanRepository {
  async getAllKaryawan(): Promise<Karyawan[]> {
    // Melakukan HTTP request langsung menggunakan axios client
    const response = await apiClient.get<KaryawanDTO[]>("/v1/karyawan");
    
    return response.data.map(KaryawanMapper.toEntity); // Mengubah semua DTO menjadi Entity bersih
  }
}
```

---

## 🔌 3. Dependency Injection Layer (`di/`)

Layer penghubung rahasia agar layer presentation/UI tidak bocor ke dalam data layer.

### 📁 `di/container.ts`

- **Fungsi:** Merakit instansiasi class dari data layer dan domain layer sehingga siap diekspor ke Custom Hooks presentation sebagai objek jadi.
- **Contoh Isi:**

```typescript
import { KaryawanRepositoryImpl } from "../data/repositories/KaryawanRepositoryImpl";
import { GetKaryawanUseCase } from "../domain/usecases/GetKaryawanUseCase";

// 1. Rakit network data source
const karyawanRepository = new KaryawanRepositoryImpl();

// 2. Inject repositori ke UseCase murni. UseCase siap pakai!
export const getKaryawanUseCase = new GetKaryawanUseCase(karyawanRepository);
```

---

## 🎨 4. Presentation Layer (`presentation/`)

Layer yang hanya peduli tentang tampilan layar mobile, interaksi pengguna, gaya komponen (*stylesheet*), dan manajemen state UI.

### 📁 `presentation/hooks/useKaryawanQuery.ts`

- **Fungsi:** Menghubungkan TanStack Query (React Query) dengan UseCase yang sudah dirakit di folder DI untuk mengelola *network state* aplikasi.
- **Contoh Isi:**

```typescript
import { useQuery } from "@tanstack/react-query";
import { getKaryawanUseCase } from "../../di/container";

export const useKaryawanQuery = () => {
  return useQuery({
    queryKey: ["karyawan-list"],
    queryFn: () => getKaryawanUseCase.execute(), // Memanggil usecase murni yang sudah dirakit
  });
};
```

### 📁 `presentation/screens/KaryawanScreen.tsx`

- **Fungsi:** Komponen halaman utama tempat data dirender ke dalam layout native mobile. Logikanya bersih karena pemanggilan data sepenuhnya diserahkan ke custom hooks.
- **Contoh Isi:**

```tsx
import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useKaryawanQuery } from "../hooks/useKaryawanQuery";

export const KaryawanScreen: React.FC = () => {
  const { data: karyawanList, isLoading, error } = useKaryawanQuery();

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Terjadi kesalahan sistem.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Karyawan</Text>
      <FlatList
        data={karyawanList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  name: { fontSize: 16, fontWeight: "600" },
  role: { fontSize: 14, color: "gray" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
```

---

## 💡 Tips Praktis untuk Implementation Lanjutan

- **File Naming & Export:** Gunakan **camelCase** untuk nama berkas custom hook (`useKaryawanQuery.ts`) dan file perakit di folder DI (`container.ts`). Gunakan **PascalCase** untuk kelas usecase, mapper, komponen screens, dan implementasi repository agar selaras dengan standar ekosistem React Native TypeScript.

---

## 🚪 5. Feature Public API (`index.ts` Utama Fitur)

### 📄 `features/karyawan/index.ts`

- **Fungsi:** Penjaga gawang fitur. Hanya mengekspos komponen halaman (*Screen*) milik presentation layer agar bisa di-import oleh sistem Navigation utama aplikasi.
- **Contoh Isi:**

```typescript
// Fitur lain HANYA boleh mengakses file ini. 
// Folder domain/, data/, di/ di dalam tidak boleh disentuh langsung dari luar!
export { KaryawanScreen } from "./presentation/screens/KaryawanScreen";
```

----
# 🏛️ Fondasi Utama & Integrasi Aplikasi (Shared + Core)

Bagian ini menjelaskan konfigurasi komunikasi data bersama (*Shared Infrastructure*) dan cara membungkus aplikasi menggunakan Provider di komponen root utama.

---

## 🌐 1. Shared Network Infrastructure

File ini mengelola konfigurasi Axios instance secara terpusat untuk mengonsumsi REST API dari backend Express.js.

### 📁 `src/shared/infrastructure/apiClient.ts`

```typescript
import axios from 'axios';

// Membuat instance Axios bersama untuk hit ke backend Express
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});
```

---

## 🌐 2. Integrasi ke Root Utama Aplikasi

Penerapan QueryClientProvider dari TanStack Query pada struktur root terdalam aplikasi agar manajemen state cache dapat diakses oleh seluruh layar fitur.

### 📁 `App.tsx`

```tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  
import { KaryawanScreen } from './src/features/karyawan'; // Otomatis membaca pintu gerbang index.ts

const queryClient = new QueryClient();

export default function App() {  
return (  
  
  
  
  
  
);  
}

const styles = StyleSheet.create({  
container: {  
flex: 1,  
backgroundColor: '#fff',  
},  
});  
```
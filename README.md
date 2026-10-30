# React Native Clean Architecture

Mobile app using **Feature-Based Clean Architecture** with React Native, TypeScript, and Expo SDK 58.

## Stack

- React Native 0.88 + Expo 58
- TypeScript 6.x
- TanStack Query (React Query) 5.x
- Axios 1.x
- ESLint + TypeScript strict mode

## Project Structure

```
src/
├── shared/                    # Global utilities
│   ├── components/           # Shared UI components
│   └── infrastructure/
│       └── apiClient.ts      # Axios instance for backend API
│
└── features/                 # Feature modules (e.g., karyawan)
    ├── index.ts              # Public API (navigation gateway)
    │
    ├── domain/               # Business logic (pure TS)
    │   ├── entities/
    │   ├── repositories/
    │   └── usecases/
    │
    ├── data/                 # Data layer (API, DTOs, mappers)
    │   ├── dtos/
    │   ├── mappers/
    │   ├── services/         # Axios calls (KaryawanApiService.ts)
    │   └── repositories/
    │
    ├── di/                   # Dependency injection container
    │
    └── presentation/         # UI layer
        ├── screens/
        ├── components/
        ├── hooks/
        └── store/
```

## Available Scripts

```bash
bunx expo start      # Start development server
bunx expo start --android   # Android emulator
bunx expo start --ios       # iOS emulator
bunx expo lint    # Run linter
npx tsc --noEmit  # Type checking
```

## Documentation

- [**rules.md**](documentation/rules/rules.md) - Coding standards & layer guidelines
- [**visualisasi architecture.md**](documentation/rules/visualisasi%20architecture.md) - Architecture diagrams

## Key Patterns

1. **Domain layer** - Pure TypeScript, no React imports
2. **Data layer** - API calls separated into `*ApiService.ts`
3. **DI container** - Wires dependencies, no UI leakage
4. **Public API** - `index.ts` protects internal structure

## Environment

Configure API URL in `.env`:
```
EXPO_PUBLIC_API_URL=http://your-api.com/api/v1
```
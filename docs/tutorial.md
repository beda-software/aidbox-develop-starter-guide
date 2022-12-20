---
sidebar_position: 1
title: Tutorial
---

# aidbox-develop-starter-guide

## Intro

Welcome to the tutorial! In this tutorial, we will be creating a MVP application
for doctors in laboratories to use for determining *hemoglobin levels.

<sub><sup>*Hemoglobin is a protein found in the blood that is responsible
for transporting oxygen throughout the body.
It is measured in units per deciliter of blood (g/dL).</sup></sub>

## Features

- Getting the [Patient](https://build.fhir.org/patient.html) resource list
- Create a Patient resource
- Getting a list of [Observation](https://build.fhir.org/observation.html)
resources for the specified patient
- Creating an Observation resource

## Setup

Create a directory with any name, in the tutorial it will be called `main-directory`.

In the `main-directory`, create and launch an [Aidbox application](https://www.health-samurai.io/aidbox) by following the [guide on the official Aidbox documentation site](https://docs.aidbox.app/getting-started/run-aidbox-locally-with-docker).

Next, in the `main-directory` create a React application with the command:

```bash
yarn create react-app frontend --template typescript
```

Let's add some improvements to the application's aidbox port and project structure:

- Rename `aidbox-docker-compose` directory to `aidbox-project`
- Replace aidbox port in the .env file:

```diff
...
- AIDBOX_PORT=8888
+ AIDBOX_PORT=8080
...
```

You should end up with this file structure:

```
main-directory
├── aidbox-project
│   ├── docker-compose.yaml
│   ├── .env
│   ├── pgdata
│   ├── zen-package.edn
│   └── zrc
└── frontend
    ├── .gitignore
    ├── node_modules
    ├── package.json
    ├── public
    ├── README.md
    ├── src
    ├── tsconfig.json
    └── yarn.lock
```

Delete unused files in `frontend/src/` so all you have left are these:

```
src
├── App.tsx
├── index.css
├── index.tsx
└── react-app-env.d.ts
```

Replace the code in `App.tsx` with the code:

```typescript jsx
export function App() {
  return <div>App</div>;
}
```

Replace the code in `index.tsx` with the code:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Добавим Typescript настройки, создав файл `tsconfig.json:` в директории `frontend`:

```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
    },
    "include": ["src"]
}
```

Add the prettier package with the command:

```bash
yarn add prettier
```

Create a `.prettierrc.js` file in the `frontend` directory, with the contents:

```javascript
module.exports = {
    bracketSpacing: true,
    jsxBracketSameLine: false,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    arrowParens: 'always',
    printWidth: 100,
    jsxSingleQuote: false,
};
```

Добавим в package.json скрипт для форматирования всех файлов:

```json
"scripts": {
  ...
+ "format": "npx prettier --write ."
  ...
},
```

Соответсвенно форматриуем все файлы командой в консоли:

```bash
npm run format
```

Создадим в директории `src` несколько новых директорий:

- `components` 
- `containers`
- `services`
- `types`
- `utils`

В итоге наша структура будет такого вида:

```bash
main-directory/
├── aidbox-project/
│   ├── docker-compose.yaml
│   ├── .env
│   ├── .git/
│   ├── pgdata/
│   ├── zen-package.edn
│   └── zrc/
└── frontend/
    ├── .gitignore
    ├── node_modules/
    ├── package.json
    ├── .prettierrc.js
    ├── .tsconfig.json
    ├── public/
    ├── README.md
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   ├── containers/
    │   ├── index.css
    │   ├── index.tsx
    │   ├── react-app-env.d.ts
    │   ├── services/
    │   ├── types/
    │   └── utils/
    ├── tsconfig.json
    └── yarn.lock
```

## Контейнеры
 
Компоненты принятно делить на `smart` и `dumb`.
- `smart` компоненты помещаем в директорию `containers`
- `dumb` компоненты помещаем в папку `components`

В директории `containers` создадим директорию `App` и переместим в нее `App.tsx` компонент.
Переименуем его в `index.tsx`.

Для роутинга мы будем использовать библиотеку [React Router](https://reactrouter.com/).

Для более быстрой разработки также будем использовать библиотеку компонент [Ant Design](https://ant.design/)

Основным инструментом, на изучение которого направлен данный туториал,
является библиотека [aidbox-react](https://www.npmjs.com/package/aidbox-react).

Добавим данные инструменты:

```bash
yarn add aidbox-react react-router-dom antd
```

В приложении будет 3 контейнера-компоненты:

- App
- Patients list
- Observations list

Создадим контейнеры PatientsList и ObservationsList в директории `src/containers`:

```
containers
├── App
│   ├── index.tsx
├── PatientsList
│   ├── index.tsx
└── ObservationsList
    ├── index.tsx
```

Создадим компоненты `SignIn`, `AlertFailure`, `Loader` в директории `src/components`:

```
components
├── SignIn
│   ├── index.tsx
├── AlertFailure
│   ├── index.tsx
└── Loader
    ├── index.tsx
```

<!-- Заменим код в компоненте `App` на следующий:

```typescript jsx
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { SignIn } from '../../components/SignIn';
import { useApp } from './hooks';
import { ObservationsList } from '../ObservationsList';
import { PatientsList } from '../PatientsList';
import { Loader } from '../../components/Loader';
import { AlertFailure } from '../../components/AlertFailure';

export function App() {
    const { userResponse } = useApp();

    return (
        <BrowserRouter>
            <RenderRemoteData
                remoteData={userResponse}
                renderFailure={(error) => <AlertFailure error={error} />}
                renderLoading={() => <Loader />}
            >
                {(user) => (
                    <Routes>
                        {user ? (
                            <>
                                <Route path="patients" element={<PatientsList />} />
                                <Route path="patients/:patientId/" element={<ObservationsList />} />
                                <Route path="*" element={<Navigate to="/patients" />} />
                            </>
                        ) : (
                            <>
                                <Route path="signin" element={<SignIn />} />
                                <Route path="*" element={<Navigate to="/signin" />} />
                            </>
                        )}
                    </Routes>
                )}
            </RenderRemoteData>
        </BrowserRouter>
    );
}
``` -->

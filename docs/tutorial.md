---
sidebar_position: 1
title: Tutorial
---

# aidbox-develop-starter-guide

## Intro

Welcome to the tutorial! In this tutorial, we will be creating a MVP application
for doctors in laboratories to use for determining \*hemoglobin levels.

<sub><sup>\*Hemoglobin is a protein found in the blood that is responsible
for transporting oxygen throughout the body.
It is measured in units per deciliter of blood (g/dL).</sup></sub>

## Features

- Getting the [Patient](https://www.hl7.org/fhir/patient.html) resource list
- Create a Patient resource
- Getting a list of [Observation](https://www.hl7.org/fhir/observation.html)
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
  trailingComma: "all",
  tabWidth: 4,
  arrowParens: "always",
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

## Компоненты

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

## Aidbox types

С помощтюу утилиты [aidbox-ts-generator](https://github.com/beda-software/aidbox-ts-generator) генерируется файл с TypeScript типами для FHIR ресурсов.

В директории `types` создайте файл `aidbox.ts` и поместите в него следующий [код с типами](https://gist.githubusercontent.com/atuonufure/185cea02866703405696b35493128a00/raw/82c142cf24dccc8078d7fe88ca3c7cf025564715/index.ts).

## Utils

Директория `utils` обычно используется для хранения утилитарных функций и другого служебного кода, который используется в проекте.

## Services

В директории `services` создадим файлы `initialize.ts`, `config.ts` and `auth.ts`.

Добавим в `config.ts` следующий код:

```ts
export default {
  clientId: "SPA",
  tier: "develop",
  baseURL: "http://localhost:8080",
};
```

Это конфигурационный файл, в котором будет указаны настройки для обращения к приложению Aidbox.

Добавим в `initialize.ts` следующий код:

```ts
import { setInstanceBaseURL } from "aidbox-react/lib/services/instance";

import config from "./config";

export function init(baseURL?: string) {
  setInstanceBaseURL(baseURL ?? config.baseURL);
}
```

С помощью функции `init` мы установим url на который будут отправляться запросы.

Добавим в `auth.ts` следующий код:

```ts
import { service } from "aidbox-react/lib/services/service";
import { RemoteDataResult } from "aidbox-react/lib/libs/remoteData";
import { User } from "../types/aidbox";

export function getToken() {
  return window.localStorage.getItem("token") || undefined;
}

export function setToken(token: string) {
  window.localStorage.setItem("token", token);
}

export function removeToken() {
  window.localStorage.removeItem("token");
}

export function logout() {
  removeToken();
  return service({
    method: "DELETE",
    url: "/Session",
  });
}

export function getUserInfo() {
  return service<User>({
    method: "GET",
    url: "/auth/userinfo",
  });
}

export interface SigninBody {
  email: string;
  password: string;
}

export function signin(data: SigninBody): Promise<RemoteDataResult> {
  return service({
    url: "/auth/token",
    method: "POST",
    data: {
      username: data.email,
      password: data.password,
      client_id: "SPA",
      grant_type: "password",
    },
  });
}
```

Функции в файле `auth.ts` используются для управления сеансом пользователя, получения информации о нем, а также для входа или выхода пользователя из приложения.

`service({...axiosConfig})` Basic function for making requests. WIP

## RenderRemoteData

Создадим файл `hooks.ts` в директории `containers/App`:

```ts
import { useService } from "aidbox-react/lib/hooks/service";
import { isSuccess, success } from "aidbox-react/lib/libs/remoteData";
import {
  resetInstanceToken,
  setInstanceToken,
} from "aidbox-react/lib/services/instance";
import { extractErrorCode } from "aidbox-react/lib/utils/error";
import { getToken, getUserInfo } from "../../services/auth";

export function useApp() {
  const [userResponse] = useService(async () => {
    const appToken = getToken();
    if (!appToken) {
      return success(null);
    }
    setInstanceToken({ access_token: appToken, token_type: "Bearer" });
    const response = await getUserInfo();
    if (isSuccess(response)) {
    } else {
      if (extractErrorCode(response.error) !== "network_error") {
        resetInstanceToken();
        return success(null);
      }
    }
    return response;
  });

  return { userResponse };
}
```

В большинстве случаев логику выносим в кастомные хуки для лучшей читаемости, переиспользования и тестирования.

Далее изменим код в `App.tsx':

```tsx
import { RenderRemoteData } from "aidbox-react/lib/components/RenderRemoteData";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AlertFailure } from "../../components/AlertFailure";
import { Loader } from "../../components/Loader";
import { SignIn } from "../../components/SignIn";
import { ObservationsList } from "../ObservationsList";
import { PatientsList } from "../PatientsList";
import { useApp } from "./hooks";

export function App() {
  const { userResponse } = useApp();

  return (
    <BrowserRouter>
      <RenderRemoteData
        remoteData={userResponse}
        renderFailure={() => <AlertFailure />}
        renderLoading={() => <Loader />}
      >
        {(user) => (
          <Routes>
            {user ? (
              <>
                <Route path="patients" element={<PatientsList />} />
                <Route
                  path="patients/:patientId/"
                  element={<ObservationsList />}
                />
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
```

`RenderRemoteData` - это компонент, который используется для рендеринга различного содержимого в зависимости от состояния объекта RemoteData.

Компонент `RenderRemoteData` принимает несколько параметров:

- `remoteData`: Этот параметр представляет собой объект RemoteData, который используется для управления рендерингом компонента.

- `renderFailure`: Этот параметр представляет собой функцию, которая возвращает компонент, если объект RemoteData находится в состоянии "failure". В данном случае свойство `renderFailure` - это функция, которая возвращает компонент `AlertFailure`.

- `renderLoading`: Этот параметр представляет собой функцию, которая возвращает компонент, если объект RemoteData находится в состоянии "loading". В этом случае свойство `renderLoading` является функцией, возвращающей компонент Loader.

Компонент `RenderRemoteData` также имеет дочерний параметр, который представляет собой функцию, возвращающую компонент, если объект RemoteData находится в состоянии "success".

## Approach to stylization

### Component.module.scss

In the directory of the component `AlertFailure`, create a file `AlertFailure.module.scss`:

```scss
.space {
  width: 100%;
  padding: 10px;
}
```

We use a modular design approach, which involves creating `*.module.scss` files to organize and structure styles, because it promotes reuse and creation of self-contained components, helps prevent unexpected side effects, and allows us to take advantage of advanced SCSS features and capabilities.

### Antd

Add the following code to the `AlertFailure` component:

```tsx
import { Alert, Space } from "antd";
import s from "./AlertFailure.module.scss";

interface AlertFailureProps {
  error: any;
}

export function AlertFailure({ error }: AlertFailureProps) {
  return (
    <Space direction="vertical" className={s.space}>
      <Alert message={JSON.stringify(error)} type="error" />
    </Space>
  );
}
```

This is a simple presentation component used to display an error message to the user when an asynchronous operation fails. It uses the `Alert` and `Space` components from the `antd` library to display the error message in a visually appealing way.

We use the [Ant Design](https://ant.design/) because it provides us with a library of pre-designed and consistent user interface components that are easy to use and configure. The key feature of choosing Antd is that it best meets our needs for out-of-the-box components compared to other libraries.

<!-- ## Авторизация и роутинг

Заменим код в компоненте `App` на следующий:

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

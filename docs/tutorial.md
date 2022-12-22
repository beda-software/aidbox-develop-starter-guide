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

-   Getting the [Patient](https://www.hl7.org/fhir/patient.html) resource list
-   Create a Patient resource
-   Getting a list of [Observation](https://www.hl7.org/fhir/observation.html)
    resources for the specified patient
-   Creating an Observation resource

## Setup

Create a directory with any name, in the tutorial it will be called `main-directory`.

In the `main-directory`, create and launch an [Aidbox application](https://www.health-samurai.io/aidbox) by following the [guide on the official Aidbox documentation site](https://docs.aidbox.app/getting-started/run-aidbox-locally-with-docker).

Next, in the `main-directory` create a React application with the command:

```bash
yarn create react-app frontend --template typescript
```

Let's add some improvements to the application's aidbox port and project structure:

-   Rename `aidbox-docker-compose` directory to `aidbox-project`
-   Replace aidbox port in the .env file:

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

```tsx
export function App() {
    return <div>App</div>;
}
```

Replace the code in `index.tsx` with the code:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
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

```js
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

-   `components`
-   `containers`
-   `services`
-   `types`
-   `utils`

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

-   `smart` компоненты помещаем в директорию `containers`
-   `dumb` компоненты помещаем в папку `components`

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

-   App
-   Patients list
-   Observations list

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

## Services

В директории `services` создадим файлы `initialize.ts`, `config.ts` and `auth.ts`.

Добавим в `config.ts` следующий код:

```ts
export default {
    clientId: 'client',
    tier: 'develop',
    baseURL: 'http://localhost:8080',
};
```

Это конфигурационный файл, в котором будет указаны настройки для обращения к приложению Aidbox.

Добавим в `initialize.ts` следующий код:

```ts
import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import config from './config';

export function init(baseURL?: string) {
    setInstanceBaseURL(baseURL ?? config.baseURL);
}
```

С помощью функции `init` мы установим url на который будут отправляться запросы.

Добавим в `auth.ts` следующий код:

```ts
import { service } from 'aidbox-react/lib/services/service';
import { RemoteDataResult } from 'aidbox-react/lib/libs/remoteData';
import { User } from '../types/aidbox';

export function getToken() {
    return window.localStorage.getItem('token') || undefined;
}

export function setToken(token: string) {
    window.localStorage.setItem('token', token);
}

export function removeToken() {
    window.localStorage.removeItem('token');
}

export function logout() {
    removeToken();
    return service({
        method: 'DELETE',
        url: '/Session',
    });
}

export function getUserInfo() {
    return service<User>({
        method: 'GET',
        url: '/auth/userinfo',
    });
}

export interface SigninBody {
    email: string;
    password: string;
}

export function signin(data: SigninBody): Promise<RemoteDataResult> {
    return service({
        url: '/auth/token',
        method: 'POST',
        data: {
            username: data.email,
            password: data.password,
            client_id: 'client',
            grant_type: 'password',
        },
    });
}
```

Функции в файле `auth.ts` используются для управления сеансом пользователя, получения информации о нем, а также для входа или выхода пользователя из приложения.

`service({...axiosConfig})` Basic function for making requests. WIP

## RenderRemoteData

Создадим файл `hooks.ts` в директории `containers/App`:

```ts
import { useService } from 'aidbox-react/lib/hooks/service';
import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { resetInstanceToken, setInstanceToken } from 'aidbox-react/lib/services/instance';
import { extractErrorCode } from 'aidbox-react/lib/utils/error';
import { getToken, getUserInfo } from '../../services/auth';

export function useApp() {
    const [userResponse] = useService(async () => {
        const appToken = getToken();
        if (!appToken) {
            return success(null);
        }
        setInstanceToken({ access_token: appToken, token_type: 'Bearer' });
        const response = await getUserInfo();
        if (isSuccess(response)) {
        } else {
            if (extractErrorCode(response.error) !== 'network_error') {
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
import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AlertFailure } from '../../components/AlertFailure';
import { Loader } from '../../components/Loader';
import { SignIn } from '../../components/SignIn';
import { ObservationsList } from '../ObservationsList';
import { PatientsList } from '../PatientsList';
import { useApp } from './hooks';

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
```

`RenderRemoteData` - это компонент, который используется для рендеринга различного содержимого в зависимости от состояния объекта \*RemoteData.

Компонент `RenderRemoteData` принимает несколько параметров:

-   `remoteData`: этот параметр представляет собой объект RemoteData.

-   `renderFailure`: этот параметр представляет собой функцию, которая возвращает компонент, если объект RemoteData находится в состоянии Failure. В данном случае свойство `renderFailure` - это функция, которая возвращает компонент `AlertFailure`.

-   `renderLoading`: этот параметр представляет собой функцию, которая возвращает компонент, если объект RemoteData находится в состоянии loading. В этом случае свойство `renderLoading` является функцией, возвращающей компонент Loader.

Компонент `RenderRemoteData` также имеет дочерний параметр, который представляет собой функцию, возвращающую компонент, если объект RemoteData находится в состоянии Success.

\*RemoteData is a wrapper over data.

It could have four statuses:

-   Success
-   Failure
-   Loading
-   NotAsked

RemoteDataResult is a subset of RemoteData and it could have two statuses:

-   Success
-   Failure

When we make a request to a server with any of library's methods, we'll probably get RemoteData as a result. Then we can easily check what've got.

## Approach to stylization

Add the sass package with the command:

```bash
yarn add sass
```

### Component.module.scss

In the directory of the component `AlertFailure`, create a file `AlertFailure.module.scss`:

```scss
.space {
    width: 100%;
    padding: 10px;
}
```

We use a modular design approach, which involves creating `*.module.scss` files to organize and structure styles, because it promotes reuse and creation of self-contained components, helps prevent unexpected side effects, and allows us to take advantage of advanced SCSS features and capabilities.

### Ant Design

Add the following code to the `AlertFailure` component:

```tsx
import { Alert, Space } from 'antd';
import s from './AlertFailure.module.scss';

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

We use the [Ant Design](https://ant.design/) it provides us with a library of pre-designed and consistent user interface components that are easy to use and configure. The key feature of choosing Antd is that it best meets our needs for out-of-the-box components compared to other libraries.

In `App.tsx` change the code:

```tsx
...
            <RenderRemoteData
                remoteData={userResponse}
                renderFailure={(error) => <AlertFailure error={error} />}
                renderLoading={() => <Loader />}
            >
...
```

Изменим `Loader` компонент:

```tsx
import { Spin } from 'antd';
import s from './Loader.module.scss';

export function Loader() {
    return (
        <div className={s.container}>
            <Spin />
        </div>
    );
}
```

Также добавим к нему стили `Loader.module.scss`:

```scss
.container {
    text-align: center;
    width: 100%;
}
```

## SignIn

Add the following code to the `SignIn` component:

```tsx
import { Button, Form, Input, Space, Typography } from 'antd';
import { useSignIn } from './useSignIn';
import s from './SignIn.module.scss';

export function SignIn() {
    const { onFinish, onFinishFailed } = useSignIn();

    const { Text } = Typography;

    return (
        <Space>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className={s.form}
            >
                <Text>Username</Text>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="username" />
                </Form.Item>
                <Text>Password</Text>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Space>
    );
}
```

В директории `SignIn` создадим хук `useSignIn.ts`:

```ts
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { notification } from 'antd';

import { setToken, signin, SigninBody } from '../../services/auth';

export function useSignIn() {
    const onFinish = async (values: SigninBody) => {
        const signinResponse = await signin(values);
        if (isSuccess(signinResponse)) {
            const { access_token } = signinResponse.data;
            setToken(access_token);
            window.location.reload();
        } else {
            notification.error({
                message: signinResponse.error.error_description
                    ? signinResponse.error.error_description
                    : JSON.stringify(signinResponse.error),
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.warn('Login error: ', errorInfo);
    };

    return { onFinish, onFinishFailed };
}
```

Также добавим стили `SignIn.module.scss`:

```scss
.form {
    margin: 10px;
}
```

## Utils

Директория `utils` обычно используется для хранения утилитарных функций и другого служебного кода, который используется в проекте.

Добавим библиотеку `date-fns` для более удобной работы с датой:

```bash
yarn add date-fns
```

Создадим в директории `utils` файл `date.ts` с содержимым:

```ts
import { format, parseISO } from 'date-fns';

const US_DATE_TIME_FORMAT = 'MM-dd-yyyy HH:mm';

const formatFHIRDate = (date: string, formatType: string) => {
    try {
        return format(parseISO(date), formatType);
    } catch {
        console.error(`Invalid date format: ${date}`);
        return String(date);
    }
};

export const formatHumanDateTime = (date: string) => {
    return formatFHIRDate(date, US_DATE_TIME_FORMAT);
};

export const formatHumanDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
};
```

## Prepare components

Подготовим презентационные компоненты для дальнейшей разработки:

### AppHeader

Создадим компонент `AppHeader`:

```tsx
import { Button, Space } from 'antd';
import s from './AppHeader.module.scss';
import { useAppHeader } from './useAppHeader';

interface AppHeaderProps {
    children?: JSX.Element;
}

export function AppHeader({ children }: AppHeaderProps) {
    const { onLogout } = useAppHeader();
    return (
        <Space size="middle" className={s.container}>
            {children}
            <Button key="logout" onClick={onLogout}>
                Logout
            </Button>
        </Space>
    );
}
```

Хук `useAppHeader.ts` для `AppHeader`:

```ts
import { logout } from '../../services/auth';

export function useAppHeader() {
    const onLogout = () => {
        logout();
        window.location.reload();
    };

    return {
        onLogout,
    };
}
```

Стили для `AppHeader`:

```scss
.container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
}
```

### PatientsListTable

Создадим компонент `PatientsListTable`, отвечающий за отображение списка пациентов:

```tsx
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../types/aidbox';
import { formatHumanDateTime } from '../../utils/date';

interface PatientsListTableProps {
    patientsList: Patient[];
}

export function PatientsListTable({ patientsList }: PatientsListTableProps) {
    const navigate = useNavigate();

    const goToPatientData = (patient: Patient) => navigate(`/patients/${patient.id}`);

    const { Link } = Typography;

    const dataSource = patientsList.map((patient: Patient) => {
        return {
            key: patient.id,
            patient: (
                <Link onClick={() => goToPatientData(patient)}>
                    {patient.name ? String(patient.name[0].family) : patient.id}
                </Link>
            ),
            lastUpdated: formatHumanDateTime(patient.meta?.lastUpdated || ''),
        };
    });

    const columns = [
        {
            title: <b>Patient</b>,
            dataIndex: 'patient',
            key: 'patient',
            width: '50%',
        },
        {
            title: <b>Last updated</b>,
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            width: '50%',
        },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
}
```

### ObservationsListTable

```tsx
import { Table } from 'antd';
import { Observation } from '../../types/aidbox';
import { formatHumanDateTime } from '../../utils/date';

interface ObservationsListTableProps {
    observationsList: Observation[];
}

export function ObservationsListTable({ observationsList }: ObservationsListTableProps) {
    const dataSource = observationsList.map((observation) => {
        return {
            key: observation.id,
            observation: observation.value?.Quantity?.value,
            unit: observation.value?.Quantity?.unit,
            dateTime: formatHumanDateTime(observation.effective?.dateTime || ''),
            lastUpdated: formatHumanDateTime(observation.meta?.lastUpdated || ''),
        };
    });

    const columns = [
        {
            title: <b>Value</b>,
            dataIndex: 'observation',
            key: 'observation',
            width: '25%',
        },
        {
            title: <b>Unit</b>,
            dataIndex: 'unit',
            key: 'unit',
            width: '25%',
        },
        {
            title: <b>Date & Time</b>,
            dataIndex: 'dateTime',
            key: 'dateTime',
            width: '25%',
        },
        {
            title: <b>Last updated</b>,
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            width: '25%',
        },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
}
```

### ObservationDetails

```tsx
import { Space, Typography } from 'antd';
import { Observation, Patient } from '../../types/aidbox';
import { ObservationsListTable } from '../ObservationsListTable';
import s from './ObservationsDetails.module.scss';

interface ObservationsDetailsProps {
    showObservationModal: boolean;
    setShowObservationModal: (showObservationModal: boolean) => void;
    patient: Patient;
    observationsList: Observation[];
    reloadObservationsList: () => void;
}

export function ObservationsDetails({
    showObservationModal,
    setShowObservationModal,
    patient,
    observationsList,
    reloadObservationsList,
}: ObservationsDetailsProps) {
    const { Text } = Typography;

    return (
        <>
            <Space size="middle" className={s.space}>
                <Text code>patient: {patient.name?.[0].family}</Text>
                <Text code>code: Hemoglobin [Mass/volume] in Blood (LOINC#718-7)</Text>
            </Space>
            <div className={s.table}>
                <ObservationsListTable observationsList={observationsList} />
            </div>
        </>
    );
}
```

```scss
.space {
    margin: 0 10px;
}

.table {
    margin: 10px;
}
```

## Get and show resources

### Patients list

Обновим контейнер PatientsList:

```tsx
import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { Button } from 'antd';
import { AddPatientModal } from '../../components/AddPatientModal';
import { AlertFailure } from '../../components/AlertFailure';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { PatientsListTable } from '../../components/PatientsListTable';
import { usePatientsList } from './hooks';
import s from './PatientsList.module.scss';

export function PatientsList() {
    const { showPatientModal, setShowPatientModal, patientsRD, reloadPatientsList } =
        usePatientsList();

    return (
        <>
            <AppHeader>
                <Button
                    key="create-patient"
                    onClick={() => setShowPatientModal(true)}
                    type={'primary'}
                >
                    Create patient
                </Button>
            </AppHeader>
            <AddPatientModal
                showPatientModal={showPatientModal}
                setShowPatientModal={setShowPatientModal}
                reloadPatientsList={reloadPatientsList}
            />
            <RenderRemoteData
                remoteData={patientsRD}
                renderFailure={(error) => <AlertFailure error={error} />}
                renderLoading={() => <Loader />}
            >
                {(data) => (
                    <div className={s.table}>
                        <PatientsListTable patientsList={data} />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
```

Создадим для `PatientsList` файл `hooks.ts`:

```ts
import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { useState } from 'react';
import { Patient } from '../../types/aidbox';

export function usePatientsList() {
    const [showPatientModal, setShowPatientModal] = useState(false);

    const [patientsRD, manager] = useService(async () => {
        const response = await getFHIRResources<Patient>('Patient', {
            _sort: '-_lastUpdated',
        });
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Patient;
        });
    }, []);

    const reloadPatientsList = () => {
        manager.reload();
    };

    return {
        showPatientModal,
        setShowPatientModal,
        patientsRD,
        reloadPatientsList,
    };
}
```

Создадим стили для `PatientsList`:

```scss
.table {
    margin: 0 10px;
}
```

### Observations list

Обновим контейнер `ObservationsList`:

```tsx
import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { Button, Space } from 'antd';
import { AlertFailure } from '../../components/AlertFailure';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { ObservationsDetails } from '../../components/ObservationsDetails';
import { useObservationsList } from './hooks';

export function ObservationsList() {
    const {
        navigate,
        showObservationModal,
        setShowObservationModal,
        patientObservationsMapRD,
        reloadObservationsList,
    } = useObservationsList();

    return (
        <>
            <AppHeader>
                <Space size="middle">
                    <Button onClick={() => setShowObservationModal(true)} type="primary">
                        Add observation
                    </Button>
                    <Button onClick={() => navigate('patients')}>Back</Button>
                </Space>
            </AppHeader>
            <RenderRemoteData
                remoteData={patientObservationsMapRD}
                renderFailure={(error) => <AlertFailure error={error} />}
                renderLoading={() => <Loader />}
            >
                {(data) => (
                    <ObservationsDetails
                        showObservationModal={showObservationModal}
                        setShowObservationModal={setShowObservationModal}
                        patient={data.patient}
                        observationsList={data.observations}
                        reloadObservationsList={reloadObservationsList}
                    />
                )}
            </RenderRemoteData>
        </>
    );
}
```

Добавим `hooks.ts` для `ObservationsList`:

```ts
import { useService } from 'aidbox-react/lib/hooks/service';
import {
    extractBundleResources,
    getFHIRResource,
    getFHIRResources,
} from 'aidbox-react/lib/services/fhir';
import { mapSuccess, sequenceMap } from 'aidbox-react/lib/services/service';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Observation, Patient } from '../../types/aidbox';

export function useObservationsList() {
    const navigate = useNavigate();

    const { patientId } = useParams();

    const [showObservationModal, setShowObservationModal] = useState(false);

    const [patientRD] = useService(async () => {
        const response = await getFHIRResource<Patient>({
            resourceType: 'Patient',
            id: patientId,
        });
        return response;
    });

    const [observationsRD, manager] = useService(async () => {
        const response = await getFHIRResources<Observation>('Observation', {
            _subject: patientId,
            _sort: '-_lastUpdated',
        });
        return mapSuccess(response, (bundle) => {
            return extractBundleResources(bundle).Observation;
        });
    }, []);

    const reloadObservationsList = () => {
        manager.reload();
    };

    const patientObservationsMapRD = sequenceMap({
        patient: patientRD,
        observations: observationsRD,
    });

    return {
        navigate,
        showObservationModal,
        setShowObservationModal,
        patientObservationsMapRD,
        reloadObservationsList,
    };
}
```

## Resource creation

### Aidbox REST Console

Добавим через REST консоль ресурс `Patient` используя `yaml` формат:

```yaml
POST /fhir/Patient
accept: text/yaml
content-type: text/yaml

id: pt-1
name: [{family: 'John'}]
```

Мы также можем использовать json формат, добавим для пациента `Observation` используя `json` формат:

```json
POST /fhir/Observation
accept: application/json
content-type: application/json

{
    "status": "final",
    "code": {
        "coding": [
            {
                "system": "http://loinc.org",
                "code": "718-7",
                "display": "Hemoglobin [Mass/volume] in Blood"
            }
        ]
    },
    "effectiveDateTime": "2022-12-15T06:09:20.881Z",
    "value": {
        "Quantity": {
            "value": 6,
            "unit": "g/dL"
        }
    },
    "subject": {
        "reference": "Patient/pt-1",
        "display": "John"
    }
}
```

С помощью консоли мы также можем получать ресурсы, используя GET запрос.
Например, мы можем получить [Bundle](https://www.hl7.org/fhir/bundle.html) пациентов, написав команду:

```
GET /fhir/Patient?_format=yaml
```

### Create Patient resource

С помощью метода `saveFHIRResource` из библиотеки `aidbox-react` мы можем создавать или обновлять ресурсы.

Добавим компонент модального окна с формой для создания ресурса `Patient`:

```tsx
import { isFailure, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import { Patient } from '../../types/aidbox';
import { formatHumanDate } from '../../utils/date';

interface AddPatientModalProps {
    showPatientModal: boolean;
    setShowPatientModal: (showPatientModal: boolean) => void;
    reloadPatientsList: () => void;
}

export function AddPatientModal({
    showPatientModal,
    setShowPatientModal,
    reloadPatientsList,
}: AddPatientModalProps) {
    const onFinish = async (values: { family: string; birthDate: string; gender: string }) => {
        const patient = {
            name: [
                {
                    use: 'official',
                    family: values.family,
                },
            ],
            birthDate: values.birthDate && formatHumanDate(values.birthDate),
            resourceType: 'Patient' as 'Patient',
            gender: values.gender,
        };
        const response = await saveFHIRResource<Patient>(patient);
        if (isFailure(response)) {
            message.error(response.error);
        }
        if (isSuccess(response)) {
            message.success('Patient created');
        }
        reloadPatientsList();
        setShowPatientModal(false);
    };

    return (
        <Modal
            title="Create patient"
            open={showPatientModal}
            onCancel={() => setShowPatientModal(false)}
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            <Form onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 20 }}>
                <Form.Item
                    required
                    name="family"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="birthDate" label="Date of Birth">
                    <DatePicker format="MM-DD-YYYY" />
                </Form.Item>
                <Form.Item name="gender" label="Gender">
                    <Select>
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 20 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
```

Функции `isFailure` и `isSuccess` используются для определения статуса результата запроса.

Изменим контейнер PatientsList в соответствии с параметрами необходимыми для компонента `AddPatientModal`:

```tsx
import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { Button } from 'antd';
import { AddPatientModal } from '../../components/AddPatientsModal';
import { AlertFailure } from '../../components/AlertFailure';
import { AppHeader } from '../../components/AppHeader';
import { Loader } from '../../components/Loader';
import { PatientsListTable } from '../../components/PatientsListTable';
import { usePatientsList } from './hook';
import s from './PatientsList.module.scss';

export function PatientsList() {
    const { showPatientModal, setShowPatientModal, patientsRD, reloadPatientsList } =
        usePatientsList();

    return (
        <>
            <AppHeader>
                <Button
                    key="create-patient"
                    onClick={() => setShowPatientModal(true)}
                    type={'primary'}
                >
                    Create patient
                </Button>
            </AppHeader>
            <AddPatientModal
                showPatientModal={showPatientModal}
                setShowPatientModal={setShowPatientModal}
                reloadPatientsList={reloadPatientsList}
            />
            <RenderRemoteData
                remoteData={patientsRD}
                renderFailure={(error) => <AlertFailure error={error} />}
                renderLoading={() => <Loader />}
            >
                {(data) => (
                    <div className={s.table}>
                        <PatientsListTable patientsList={data} />
                    </div>
                )}
            </RenderRemoteData>
        </>
    );
}
```

### Create Observation resource

Добавим компонент модального окна с формой для создания ресурса `Observation`:

```tsx
import { isFailure, isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Button, DatePicker, Form, InputNumber, message, Modal } from 'antd';
import { Observation, Patient } from '../../types/aidbox';

interface AddObservationModalProps {
    showObservationModal: boolean;
    setShowObservationModal: (showObservationModal: boolean) => void;
    patient: Patient;
    reloadObservationsList: () => void;
}

export function AddObservationModal({
    showObservationModal,
    setShowObservationModal,
    patient,
    reloadObservationsList,
}: AddObservationModalProps) {
    const onFinish = async (values: { dateTime: Date; value: number }) => {
        const observation = {
            status: 'final',
            code: {
                coding: [
                    {
                        system: 'http://loinc.org',
                        code: '718-7',
                        display: 'Hemoglobin [Mass/volume] in Blood',
                    },
                ],
            },
            effective: {
                dateTime: new Date(values.dateTime).toISOString(),
            },
            value: {
                Quantity: {
                    value: values.value,
                    unit: 'g/dL',
                },
            },
            subject: {
                id: `${patient.id}`,
                display: `${patient.name?.[0].family}`,
                resourceType: 'Patient' as 'Patient',
            },
            resourceType: 'Observation' as 'Observation',
        };
        const response = await saveFHIRResource<Observation>(observation);
        if (isFailure(response)) {
            message.error(response.error);
        }
        if (isSuccess(response)) {
            message.success('Observation added');
        }
        reloadObservationsList();
        setShowObservationModal(false);
    };

    return (
        <Modal
            title="Add observation"
            open={showObservationModal}
            onCancel={() => setShowObservationModal(false)}
            okButtonProps={{ style: { display: 'none' } }}
            cancelButtonProps={{ style: { display: 'none' } }}
        >
            <Form onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item
                    name="value"
                    label="Value"
                    rules={[{ required: true, message: 'Please enter a value' }]}
                >
                    <InputNumber addonAfter="g/dL" />
                </Form.Item>
                <Form.Item
                    name="dateTime"
                    label="Date"
                    rules={[{ required: true, message: 'Please enter a date and time' }]}
                >
                    <DatePicker showTime format="MM-DD-YYYY HH:mm" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
```

Обновим `ObservationsDetails` в соответствии с параметрами компонента `AddObservationModal`:

```tsx
import { Space, Typography } from 'antd';
import { Observation, Patient } from '../../types/aidbox';
import { AddObservationModal } from '../AddObservationModal';
import { ObservationsListTable } from '../ObservationsListTable';
import s from './ObservationsDetails.module.scss';

interface ObservationsDetailsProps {
    showObservationModal: boolean;
    setShowObservationModal: (showObservationModal: boolean) => void;
    patient: Patient;
    observationsList: Observation[];
    reloadObservationsList: () => void;
}

export function ObservationsDetails({
    showObservationModal,
    setShowObservationModal,
    patient,
    observationsList,
    reloadObservationsList,
}: ObservationsDetailsProps) {
    const { Text } = Typography;

    return (
        <>
            <AddObservationModal
                showObservationModal={showObservationModal}
                setShowObservationModal={setShowObservationModal}
                patient={patient}
                reloadObservationsList={reloadObservationsList}
            />
            <Space size="middle" className={s.space}>
                <Text code>patient: {patient.name?.[0].family}</Text>
                <Text code>code: Hemoglobin [Mass/volume] in Blood (LOINC#718-7)</Text>
            </Space>
            <div className={s.table}>
                <ObservationsListTable observationsList={observationsList} />
            </div>
        </>
    );
}
```

<!-- ### Configure Aidbox

Изменим файл `system.edn` в директории `aidbox-project/zrc/system.edn`, добавив Client:

```

``` -->

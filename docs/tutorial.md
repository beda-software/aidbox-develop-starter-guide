---
sidebar_position: 1
title: Tutorial
---

# aidbox-develop-starter-guide

## Intro

Welcome to the tutorial! In this tutorial, we will be creating a MVP application
for doctors in laboratories to use for determining hemoglobin levels. Hemoglobin is a protein found in the blood that is responsible for transporting oxygen throughout the body. It is measured in units per deciliter of blood (g/dL).

## Features

-   Getting the [Patient](https://www.hl7.org/fhir/patient.html) resource list
-   Create a Patient resource
-   Getting a list of [Observation](https://www.hl7.org/fhir/observation.html)
    resources for the specified patient
-   Creating an Observation resource

## Setup

Create a directory with any name, in the tutorial it will be called `main-directory`.

### Aidbox project

In the `main-directory`, create and launch an [Aidbox application](https://www.health-samurai.io/aidbox) by following the [guide on the official Aidbox documentation site](https://docs.aidbox.app/getting-started/run-aidbox-locally-with-docker).

Let's add some improvements to the application's aidbox port and project structure:

-   Rename `aidbox-docker-compose` directory to `aidbox-project`
-   Replace aidbox port in the .env file:

```diff
...
- AIDBOX_PORT=8888
+ AIDBOX_PORT=8080
...
```

In the `aidbox-project/zrc/system.edn` file replace `["client_credentials" "basic"]`with

`["client_credentials" "password"]`.

### React app

Next, in the `main-directory` create a React application with the command:

```bash
yarn create react-app frontend --template typescript
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

Add Typescript settings by creating a file `tsconfig.json` in the `frontend` directory:

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

Add a script to `package.json` to format all the files:

```json
"scripts": {
  ...
+ "format": "npx prettier --write ."
  ...
},
```

Format all files with a command in the console:

```bash
npm run format
```

Create new directories in the `src` directory:

-   `components`
-   `containers`
-   `services`
-   `types`
-   `utils`

As a result, our structure will look like this:

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

## Components

It is common to separate the components into `smart` and `dumb`.

-   The `smart` components are placed in the directory `containers`.
-   Put `dumb` components in the directory `components`.

In the directory `containers` create a directory `App` and put there `App.tsx` component.
Rename it to `index.tsx`.

For routing, we will use the [React Router](https://reactrouter.com/) library.

For faster development we will also use the [Ant Design](https://ant.design/) component library.

The main tool this tutorial aims to study is the [aidbox-react](https://www.npmjs.com/package/aidbox-react) library.

Add these packages:

```bash
yarn add aidbox-react react-router-dom antd
```

There will be 3 "smart" components in the application:

-   App
-   Patients list
-   Observations list

Create the `PatientsList` and `ObservationsList` containers in the `src/containers` directory:

```
containers
├── App
│   ├── index.tsx
├── PatientsList
│   ├── index.tsx
└── ObservationsList
    ├── index.tsx
```

Create components `SignIn`, `AlertFailure`, `Loader` in `src/components` directory:

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

The [aidbox-ts-generator](https://github.com/beda-software/aidbox-ts-generator) utility generates a file with TypeScript types for FHIR resources.

In the `types` directory, create a file `aidbox.ts` and put the following [code with types](https://gist.githubusercontent.com/atuonufure/185cea02866703405696b35493128a00/raw/82c142cf24dccc8078d7fe88ca3c7cf025564715/index.ts) in it.

## Services

Create files `initialize.ts`, `config.ts` and `auth.ts` in directory `services`.

Add the following code to `config.ts`:

```ts
export default {
    clientId: 'client',
    tier: 'develop',
    baseURL: 'http://localhost:8080',
};
```

This is the configuration file that will specify the settings for accessing the Aidbox application.

Add the following code to `initialize.ts`:

```ts
import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

import config from './config';

export function init(baseURL?: string) {
    setInstanceBaseURL(baseURL ?? config.baseURL);
}
```

With the `init` function we will set the url to which the requests will be sent.

Add the following code to `auth.ts`:

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

The functions in the `auth.ts` file are used to manage the user's session, to get information about the user, and to log the user in or out of the application.

## `service({...axiosConfig})`

This is a utility function that is used to make HTTP requests to an Aidbox server.

The `service` function returns a Promise that resolves to a `RemoteDataResult` object.

The `RemoteDataResult` object can be in one of states: "not asked", "loading", or "success/failure".

- If the `RemoteDataResult` object is in the "not asked" state, it means that the asynchronous operation has not yet been initiated.

- If the `RemoteDataResult` object is in the "loading" state, it means that the asynchronous operation is in progress.

- If the `RemoteDataResult` object is in the "success/failure" state, it means that the asynchronous operation has completed. If the operation was successful, the `RemoteDataResult` object will have a data property containing the response data. If the operation failed, the `RemoteDataResult` object will have an error property containing an error object.

The aidbox-react library provides utility functions like `isSuccess`, and `isFailure` that you can use to check the state of a `RemoteDataResult` object and take appropriate action based on the state.

Here is an example of how the `service` function can be used:

```ts
import { service } from 'aidbox-react/lib/services/service';

const result = await service({
    method: 'GET',
    url: '/Patient',
});

if (isSuccess(result)) {
    // The request was successful, and the response data is available in result.data
    console.log(result.data);
} else if (isFailure(result)) {
    // The request failed, and the error is available in result.error
    console.error(result.error);
}
```

## `useService`

In most cases, we put the logic into custom hooks for better readability, reuse and testing.

Create a file `hooks.ts` in the directory `containers/App`:

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

The `useService` hook is a utility provided by the aidbox-react library that allows easily make HTTP requests from a React component and manage the state of the request. It is similar to the `useEffect` hook in that it will execute a function when certain dependencies change, but it is specifically designed for making HTTP requests.

The `useService` hook takes an async function as an argument, which should contain the logic for making the HTTP request. The hook will handle setting the component's state to "loading" while the request is in progress, and will update the state with the response data or error if the request succeeds or fails.

## `RenderRemoteData`

Next, change the code in `App.tsx':

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

The `RenderRemoteData` component is used to render different content depending on the state of the `RemoteData` object.

The `RenderRemoteData` component takes several parameters:

- `remoteData`: this parameter represents a `RemoteData` object.

- `renderFailure`: this parameter represents a function that returns the component if the `RemoteData` object is in `Failure` state. In this case, the `renderFailure` property is a function that returns the `AlertFailure` component.

- `renderLoading`: This parameter is a function that returns the component if the `RemoteData` object is in the `loading` state. In this case, the `renderLoading` property is a function that returns the `Loader` component.

The `RenderRemoteData` component also has a child parameter, which is a function that returns the component if the `RemoteData` object is in the `Success` state.

`RemoteData` is a wrapper over data.

It could have four statuses:

-   Success
-   Failure
-   Loading
-   NotAsked

`RemoteDataResult` is a subset of `RemoteData` and it could have two statuses:

-   Success
-   Failure

When we make a request to a server with any of `aidbox-react` methods, we'll probably get `RemoteData` as a result. Then we can easily check what've got.

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

Change the `Loader` component:

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

Also add the styles `Loader.module.scss` to it:

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

In the `SignIn` directory create a hook `useSignIn.ts`:

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

Also add the styles `SignIn.module.scss`:

```scss
.form {
    margin: 10px;
}
```

## Utils

The `utils` directory is normally used to store utility functions and other service code used in the project.

Let's add the `date-fns` library to make working with date more convenient:

```bash
yarn add date-fns
```

Create a file `date.ts` in the `utils` directory with the contents:

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

Prepare `dump` components:

### AppHeader

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

Hook `useAppHeader.ts` for `AppHeader`:

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

Styles for `AppHeader`:

```scss
.container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
}
```

### PatientsListTable

Create a component `PatientsListTable` that displays a list of patients:

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

Create a component that displays the observations list for the patient:

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

Let's update the PatientsList container:

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

### `getFHIRResources`

The `getFHIRResources` function allows easily retrieve a list of FHIR resources from an Aidbox instance.

### `mapSuccess`

The `mapSuccess` function allows transform the data of a successful RemoteDataResult object. It can be useful when you want to transform the data returned by an async function before it is consumed by a component, without having to check the state of the RemoteDataResult object in the component itself.

### `extractBundleResources`

`extractBundleResources` is a utility function that takes a FHIR Bundle resource and extracts the individual resources that are contained within it. The function returns an object with keys for each resource type, and the value for each key is an array of resources of that type.

For example, if the Bundle resource contains 2 Patient resources and 3 Observation resources, the returned object would look like this:

```ts
{
  Patient: [patient1, patient2],
  Observation: [observation1, observation2, observation3]
}
```

Create a file `hooks.ts` for `PatientsList`:

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

Create styles for the `PatientsList`:

```scss
.table {
    margin: 0 10px;
}
```

### Observations list

Let's update the `ObservationsList` container:

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

### `getFHIRResource`

`getFHIRResource` is a function that is used to retrieve a single FHIR resource from a server. It takes an object as an argument, which should contain the resourceType of the resource being requested and the id of the specific resource. It returns a Promise that resolves to a `RemoteDataResult` object.

### `sequenceMap`

`sequenceMap` is a function that takes an object containing `RemoteData` values as its argument, and returns a new `RemoteData` value that represents the combination of all of the input `RemoteData` values. If all of the input `RemoteData` values are successful, then the returned `RemoteData` value will be successful and will contain an object with the same keys as the input object, but with the successful data values as the values. If any of the input `RemoteData` values are not successful, then the returned `RemoteData` value will be not successful and will contain the error value of the first not successful input `RemoteData` value.

Add `hooks.ts` for `ObservationsList`:

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

Let's add a `Patient` resource via Aidbox REST console using `yaml` format:

```yaml
POST /fhir/Patient
accept: text/yaml
content-type: text/yaml

id: pt-1
name: [{family: 'John'}]
```

We can also use `json` format, add `Observation` for the patient using `json` format:

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

With the Aidbox REST console, we can also retrieve resources using a GET request.
For example, we can get [Bundle](https://www.hl7.org/fhir/bundle.html) patients by writing the command:

```
GET /fhir/Patient?_format=yaml
```

### Create Patient resource

### `saveFHIRResource`

The `saveFHIRResource` function is a utility function that allows create or update a FHIR resource in an Aidbox instance. It takes in a FHIR resource object and returns a Promise that resolves to a `RemoteDataResult` object. 

Let's add a modal window component with a form to create the `Patient` resource:

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

The functions `isFailure` and `isSuccess` are used to determine the status of the query result.

Let's change the `PatientsList` container according to the parameters required for the `AddPatientModal` component:

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

Let's add a modal window component with a form to create the `Observation` resource:

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

Update `ObservationsDetails` according to the parameters of the `AddObservationModal` component:

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

## Summary

In this tutorial, we have tried to create a solid foundation for using `aidbox-react` to develop stable and scalable healthcare applications. Using the tutorial, we learned how to create a small MVP application and became familiar with the basic methods and features offered by the `aidbox-react` library. These tools allowed us to easily retrieve and manipulate data from the aidbox server, simplifying the process of building our application.

<!-- TODO: ### Configure Aidbox -->

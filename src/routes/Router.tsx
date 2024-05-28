import React from 'react';
import {createBrowserRouter} from 'react-router-dom';
import App from 'App';
import Error from 'components/layout/Error';
import { routerList } from './RouterList';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...routerList
    ],
    errorElement: <Error />
  },
  {
    path: "/*",
    element: <Error />
  }
]);


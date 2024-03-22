import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from 'App';
import Error from 'components/layout/Error';
import { routerList } from './RouterList';

function RouterPage(){
  const router = createBrowserRouter([
    {
      path:"/",
      element: <App />,
      caseSensitive: true, // 대소문자를 구분하여 일치
      children:[
        ...routerList,
      ]
    },
    {
      path:"/*",
      element:<Error />
    }
  ])
  return <RouterProvider router={router} />;
  // fallbackElement={<div>Loading...TEST</div>} 
}
export default RouterPage;

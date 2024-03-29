import {createBrowserRouter} from 'react-router-dom';
import App from 'App';
import Error from 'components/layout/Error';
import { routerList } from './RouterList';

export const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    // caseSensitive: true, // 대소문자를 구분하여 일치
    children:[
      ...routerList
    ],
    errorElement: <Error />
  },
  {
    path:"/*",
    element:<Error />
  }
])
// fallbackElement={<div>Loading...TEST</div>} 



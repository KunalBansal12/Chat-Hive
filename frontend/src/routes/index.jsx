import {createBrowserRouter} from 'react-router-dom'
import CheckEmailPage from '../pages/CheckEmailPage'
import CheckPasswordPage from '../pages/CheckPasswordPage'
import Home from '../pages/Home'
import App from '../App'
import MessagePage from '../components/MessagePage'
import RegisterPage from '../pages/RegisterPage'
import AuthLayout from '../layout'
import ForgotPassword from '../pages/ForgotPassword'

const router = createBrowserRouter([
    {
        path: "/",
        element : <App />,
        children : [
            {
                path: "register",
                element : <AuthLayout><RegisterPage /></AuthLayout>
            },
            {
                path: "email",
                element: <AuthLayout><CheckEmailPage /></AuthLayout>
            },
            {
                path: "password",
                element: <AuthLayout><CheckPasswordPage /></AuthLayout>
            },{
                path: "forgot-password",
                element: <AuthLayout><ForgotPassword /></AuthLayout>
            },
            {
                path: "",
                element: <Home/>,
                children : [
                    {
                        path: ":userId",
                        element : <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router
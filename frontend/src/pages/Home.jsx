import axios from "axios";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {useSetRecoilState } from "recoil";
import { onlineAtom, tokenAtom, userAtom} from "../recoil/atoms";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png"
import io from "socket.io-client"
import { usesocket } from "../App";
import { Logout } from "../recoil/logout";

const Home=()=>{
    const setTokenAtomValue=useSetRecoilState(tokenAtom)
    const setUserAtomValue=useSetRecoilState(userAtom)
    const setOnlineAtom=useSetRecoilState(onlineAtom)
    const {setSocketConn}=usesocket();
    const navigate=useNavigate();
    const location=useLocation();
    
    const fetchUserDetails=async()=>{
        try{
            const URL=`${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
            const res= await axios({
                url: URL,
                withCredentials: true
            })

            setUserAtomValue({
                _id: res.data.data._id,
                email: res.data.data.email,
                name: res.data.data.name,
                profile_pic: res.data.data.profile_pic,
            })

            if(res.data.data.logout){
                <Logout />
                navigate('/email');
            }

            console.log("Current user details",res)
        } catch(error){
            console.log("error",error);
        }
    }

    useEffect(()=>{
        fetchUserDetails()
    },[])

    // socket connection
    useEffect(()=>{
        const socketConnection=io(process.env.REACT_APP_BACKEND_URL,{
            auth:{
                token: localStorage.getItem('token')
            },
        })

        socketConnection.on('onlineUser',(data)=>{
            console.log("data",data)
            setOnlineAtom(data)
        })

        console.log(socketConnection)
        setSocketConn(socketConnection)

        return ()=>{
            socketConnection.disconnect()
        }
    },[])

    const basePath=location.pathname === '/'

    return <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
            <Sidebar />
        </section>

        <section className={`${basePath && "hidden"}`}>
            <Outlet />
        </section>

        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg-flex"}`}>
            <div>
                <img
                   src={logo}
                   width={250}
                   alt="logo"
                />
            </div>
            <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
        </div>
    </div>
}

export default Home;
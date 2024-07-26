import { useEffect, useState } from "react";
import {PiUserCircle} from "react-icons/pi"
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from "../components/Avatar";
import { useSetRecoilState } from "recoil";
import { tokenAtom} from "../recoil/atoms";

const CheckPasswordPage=()=>{
    const [data,setData]=useState({
        password: ""
    })

    const navigate=useNavigate();
    const location=useLocation();
    const setTokenAtomValue=useSetRecoilState(tokenAtom);
    
    useEffect(()=>{
        if(!location?.state?.name){
            navigate('/email')
        }
    },[])

    const handleOnChange=(e)=>{
        const {name, value}=e.target;

        setData((prev)=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        e.stopPropagation();

        const URL=`${process.env.REACT_APP_BACKEND_URL}/api/password`;


        try{
            const res=await axios({
                method: "post",
                url: URL,
                data : {
                    userId: location?.state?._id,
                    password: data.password
                },
                withCredentials: true
            });

            toast.success(res.data.message);

            if(res.data.success){
                setTokenAtomValue(res.data.token);
                localStorage.setItem('token',res.data.token);
                setData({
                    password: "",
                })

                navigate('/')
            }
        } catch(err){
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
    }

    const forgotpass=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        navigate('/forgot-password',{
            state: location?.state
        })
    }

    return <div className="mt-5">
        <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
            
            <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
                {/* <PiUserCircle
                    size={80}
                /> */}
                <Avatar width={70} height={70} name={location?.state?.name} ImageURL={location?.state?.profile_pic} />
                <h2 className="font-semibold text-lg mt-1 mx-auto">{location?.state?.name}</h2>
            </div>

            <h3>Welcome to Chat Hive</h3>

            <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password :</label>
                    <input
                        type='password'
                        id= 'password'
                        name= 'password'
                        placeholder="Enter your password"
                        className="bg-slate-100 px-2 py-1 focus:outline-primary"
                        value={data.password}
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <button
                  className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
                >
                    Login
                </button>

            </form>

            <p className="my-3 text-center"><button onClick={forgotpass} className= "hover:text-primary font-semibold">Forgot password?</button></p>
        </div>
    </div>
}

export default CheckPasswordPage;
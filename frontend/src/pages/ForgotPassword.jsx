import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "../components/Loading";

const ForgotPassword=()=>{
    const [data,setData]=useState({
        password: ""
    })
    const [verify,setVerify]=useState(0);
    const [loading,setLoading]=useState(0);
    const [otp,setOtp]=useState(0);
    const location=useLocation();
    const {state}=location;
    const navigate=useNavigate();

    useEffect(()=>{
        if(!state?.name){
            navigate('/email')
        }
    },[])

    useEffect(()=>{
        
    })

    const handleOnChange=(e)=>{
        const {name, value}=e.target;

        setData((prev)=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    // console.log(location)

    const verifyEmail=async(e)=>{
        e.preventDefault();
        e.stopPropagation();
        
        const URL=`${process.env.REACT_APP_BACKEND_URL}/api/send_otp`;

        try{
            setLoading(1);
            const res=await axios({
                method:'post',
                url:URL,
                data : {
                    email: state?.email
                    }
                }
            );
            if(res.data.success){
                setVerify(1);
                setLoading(0);
                toast.success(res.data.message);
            }
        } catch(err){
            setLoading(0);
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
    }

    const verifyOtp=async(e)=>{
        e.preventDefault();
        e.stopPropagation();

        const URL=`${process.env.REACT_APP_BACKEND_URL}/api/verify_otp`;

        try{
            const res=await axios({
                method:'post',
                url:URL,
                data : {
                    email: state?.email,
                    otp: otp
                    }
                }
            );
            if(res.data.success){
                toast.success(res.data.message);
                setVerify(2);
            }
        } catch(err){
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        e.stopPropagation();

        const URL=`${process.env.REACT_APP_BACKEND_URL}/api/new-password`;


        try{
            const res=await axios({
                method: "put",
                url: URL,
                data : {
                    userId: state?._id,
                    password: data.password
                },
                withCredentials: true
            });

            toast.success(res.data.message);
            location.state.password=data.password;

            if(res.data.success){
                setData({
                    password: "",
                })
                navigate('/password',{
                    state: state
                })
            }
        } catch(err){
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
    }

    return <div className="mt-5">
        <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">

            <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
                <Avatar width={70} height={70} name={state?.name} ImageURL={state?.profile_pic} />
                <h2 className="font-semibold text-lg mt-1 mx-auto">{state?.name}</h2>
            </div>

            <h3>Welcome to Chat Hive</h3>

            <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>

                {
                    loading==1 && <Loading/>
                }
                {
                    loading==0 && verify==0 && (
                        <div className="flex flex-col gap-1">
                            Email: 
                            {" "+state?.email}
                            <p className="text-primary hover:text-secondary rounded px-2 w-auto self-start cursor-pointer" onClick={verifyEmail}>Verify!</p>
                        </div>
                    )
                }

                {
                    verify==1 && (
                        <div className="flex flex-col gap-1">
                        <label htmlFor="otp">Otp :</label>
                        <input
                            type='text'
                            id= 'otp'
                            name= 'otp'
                            placeholder="Enter otp"
                            className="bg-slate-100 px-2 py-1 focus:outline-primary"
                            onChange={e=>setOtp(e.target.value)}
                            required
                        />
                        {
                            otp!=0 && (
                                <button className="text-primary hover:text-secondary rounded px-2 w-auto self-start" onClick={verifyOtp}>Verify!</button>
                            )
                        }
                        </div>
                    )
                }

                {
                    verify==2 && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password">New Password :</label>
                                <input
                                    type='password'
                                    id= 'password'
                                    name= 'password'
                                    placeholder="Enter new password"
                                    className="bg-slate-100 px-2 py-1 focus:outline-primary"
                                    value={data.password}
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                            <button
                              className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
                            >
                                Submit
                            </button>
                        </>
                    )
                }

            </form>
        </div>
    </div>
}

export default ForgotPassword; 
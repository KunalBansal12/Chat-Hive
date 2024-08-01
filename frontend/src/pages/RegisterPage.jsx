import { useState } from "react";
import {IoClose} from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../helper/uploadFile";
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from "../components/Loading";

const RegisterPage=()=>{
    const [data,setData]=useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    })
    const [otp,setOtp]=useState(0);
    const [verify,setVerify]=useState(1);
    const [loading,setLoading]=useState(0);

    const navigate=useNavigate();
    const [uploadPhoto,setUploadPhoto]=useState("");

    // console.log(data);
    const handleOnChange=(e)=>{
        const {name, value}=e.target;
        if(verify==3 && name=="email") setVerify(1);

        setData((prev)=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadPhoto=async (e)=>{
        console.log("handle upload photo")
        const file=e.target.files[0];

        const uploadPhoto=await uploadFile(file)

        setUploadPhoto(file)
        setData((prev)=>{
            return{
                ...prev,
                profile_pic: uploadPhoto?.url
            }
        })
    }

    const handleClearUploadPhoto=(e)=>{
        console.log("handle clear upload photo")
        e.stopPropagation();
        e.preventDefault();
        setUploadPhoto(null)
        setData((prev)=>{
            return{
                ...prev,
                profile_pic: null
            }
        })
    }

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
                    email: data.email
                    }
                }
            );
            if(res.data.success){
                setVerify(2);
                setLoading(0);
                toast.success(res.data.message);
            }
        } catch(err){
            setLoading(0);
            toast.error(err?.response?.data?.message);
            // console.log("error",err);
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
                    email: data.email,
                    otp: otp
                    }
                }
            );
            if(res.data.success){
                toast.success(res.data.message);
                setVerify(3);
            }
        } catch(err){
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
    }

    const handleSubmit=async (e)=>{
        e.preventDefault();
        e.stopPropagation();

        if(verify==3){
            const URL=`${process.env.REACT_APP_BACKEND_URL}/api/register`;

        try{
            const res=await axios.post(URL,data);

            toast.success(res.data.message);

            if(res.data.success){
                setData({
                    name: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                })

                navigate('/email')
            }
        } catch(err){
            toast.error(err?.response?.data?.message);
            console.log("error",err);
        }
        }else{
            toast.error("Verify your email")
        }
    }

    return <div className="mt-5">
        <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
            <h3>Welcome to Chat Hive</h3>

            <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="name">Name :</label>
                    <input
                        type='text'
                        id= 'name'
                        name= 'name'
                        placeholder="Enter your name"
                        className="bg-slate-100 px-2 py-1 focus:outline-primary"
                        value={data.name}
                        onChange={handleOnChange}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    {
                        loading ? <Loading/> : (<>
                            <label htmlFor="email">Email :</label>
                        <input
                            type='email'
                            id= 'email'
                            name= 'email'
                            placeholder="Enter your email"
                            className="bg-slate-100 px-2 py-1 focus:outline-primary"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                        {
                        data.email && verify==1 && (
                            <p className="text-primary hover:text-secondary rounded px-2 w-auto self-start cursor-pointer" onClick={verifyEmail}>Verify!</p>
                        )
                        }
                        </>
                        )
                    }
                    {
                        verify==3 && (
                            <p className="text-secondary rounded px-2 w-auto self-start cursor-pointer">Verified!</p>
                        )
                    }
                </div>

                {
                    verify==2 && (
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

                <div className="flex flex-col gap-1">
                    <label htmlFor="profile_pic">Profile pic :

                        <div className="h-14 mt-1 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                            <p className="text-sm max-w-[300px] text-ellipses line-clamp-1">
                                {uploadPhoto?.name ? uploadPhoto.name : "Upload profile photo"}
                            </p>
                            {
                                uploadPhoto?.name && (
                                    <button className="text-lg ml-2 mt-1 hover:text-red-600"
                                            onClick={handleClearUploadPhoto}>
                                        <IoClose/>
                                    </button>
                                )
                            }
                        </div>

                    </label>
                    <input
                        type='file'
                        id= 'profile_pic'
                        name= 'profile_pic'
                        className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
                        onChange={handleUploadPhoto}
                    />
                </div>

                <button
                  className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide"
                >
                    Register
                </button>

            </form>

            <p className="my-3 text-center">Already have account ? <Link to={"/email"} className= "hover:text-primary font-semibold">Signin</Link></p>
        </div>
    </div>
}

export default RegisterPage;
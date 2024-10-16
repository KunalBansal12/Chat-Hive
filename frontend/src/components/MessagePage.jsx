import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usesocket } from "../App";
import Avatar from "./Avatar";
import { useRecoilValue } from "recoil";
import { onlineAtom, userAtom } from "../recoil/atoms";
import {HiDotsVertical} from "react-icons/hi"
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus, FaImage, FaVideo } from "react-icons/fa";
import uploadFile from "../../helper/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import backgroundImage from '../assets/wallapaper.jpeg'
import {IoMdSend} from 'react-icons/io'
import moment from 'moment'
import toast from "react-hot-toast";

const MessagePage= () =>{
    const params=useParams();
    const {socketConn}=usesocket();
    const navigate=useNavigate();
    // useEffect(()=>{
    //     if(socketConn){
    //         console.log("param",params.userId);
    //         socketConn.emit('check-user',params.userId);

    //         socketConn.on('check-reply',(data)=>{
    //             if(!data.ans){
    //                 navigate('/')
    //             }
    //         })
    //     }
    // },[socketConn,params?.userId])
    const userValue=useRecoilValue(userAtom);
    const [dataUser,setDataUser]=useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false,
        _id: ""
    })

    const [openImageVideoUpload,setOpenImageVideoUpload]=useState(false)
    const [message,setMessage]=useState({
        text: "",
        imageUrl: "",
        videoUrl: "",
    })
    const [loading,setLoading]=useState(false)
    const [allMessage,setAllMessage]=useState([]);
    const currentMessage=useRef(null);

    useEffect(()=>{
        setTimeout(()=>{
            if(currentMessage.current){
                currentMessage.current.scrollIntoView({behavior: "smooth", block : "end"})
            }
            // console.log("timeout")
        },500)
    },[allMessage])

    const handleUploadImageVideoOpen=()=>{
        setOpenImageVideoUpload(prev=>!prev)
    }

    const handleUploadImage=async (e)=>{
        const file=e.target.files[0];
        e.target.value=null;
        if(!file || !file.type.startsWith('image/')){
            toast.error("Please select a valid image type")
        }
        else{
            setLoading(true)
            const uploadPhoto=await uploadFile(file)
            
            setMessage(prev=>{
                return {
                    ...prev,
                    imageUrl: uploadPhoto.url
                }
            })
            setLoading(false)
        }
    }

    const handleUploadVideo=async (e)=>{
        const file=e.target.files[0];
        e.target.value=null;
        // console.log("file",e.target.files)
        if(!file || !file.type.startsWith('video/')){
            toast.error("Please select a valid video type")
        }
        else{
            setLoading(true)
            const uploadVideo=await uploadFile(file)
            // console.log(uploadVideo)
            
            setLoading(false)
            setOpenImageVideoUpload(false)
            setMessage(prev=>{
                return {
                    ...prev,
                    videoUrl: uploadVideo.url
                }
            })
        }
    }

    const handleClearUploadImage=()=>{
        setMessage(prev=>{
            return {
                ...prev,
                imageUrl: ""
            }
        })
    }

    const handleClearUploadVideo=()=>{
        setMessage(prev=>{
            return {
                ...prev,
                videoUrl: ""
            }
        })
    }

    const handleOnChangeText=(e)=>{
        const {name,value}=e.target;

        setMessage(prev=>{
            return{
                ...prev,
                text: value
            }
        })
    }

    const handleSendMessage=(e)=>{
        e.preventDefault();
        if(message.text || message.imageUrl || message.videoUrl){
            if(socketConn){
                socketConn.emit('new message',{
                    sender: userValue?._id,
                    reciever: params.userId,
                    text: message.text,
                    imageUrl: message.imageUrl,
                    videoUrl: message.videoUrl
                })
            }
            setMessage({
                text: "",
                imageUrl: "",
                videoUrl: "",
            })
        }
    }

    console.log("socketConn",socketConn)
    useEffect(()=>{
        if(socketConn){
            if(params.userId.length!=24) navigate('/');

            socketConn.emit('message-page',params.userId)
            let ans1=true;
            socketConn.on('check-user',(data)=>{
                if(data.ans==false) ans1=false;
            })
            if(!ans1){
                socketConn.off('check-user');
                navigate('/');
                return;
            }
            if(ans1){
                socketConn.emit('seen',params.userId)

                socketConn.on('message-user',(data)=>{
                    // console.log("user-data",data)
                    setDataUser(data)
                })
                    
                socketConn.on('message', (data) => {
                    if ((data.sender === userValue._id && data.reciever === params.userId) ||
                        (data.reciever === userValue._id && data.sender === params.userId)) {
                        setAllMessage(data.messages);
                        socketConn.emit('seen',params.userId);
                    }
                });   
                
                return () => {
                    if (socketConn) {
                        socketConn.off('check-user');
                        socketConn.off('message-user');
                        socketConn.off('message');
                    }
                };
            }
        }
    },[socketConn,params?.userId,userValue,navigate])

    return <div style={{backgroundImage: `url(${backgroundImage})`}} className="bg-no-repeat bg-cover">
        <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
            <div className="flex items-center gap-4">
                <Link to={"/"} className="lg:hidden">
                    <FaAngleLeft size={20}/>
                </Link>
                <div>
                    <Avatar
                        width={50}
                        height={50}
                        ImageURL={dataUser.profile_pic}
                        name={dataUser.name}
                        userId={dataUser._id}
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-lg my-0 text-ellipses line-clamp-1">{dataUser?.name}</h3>
                    <CheckStatus userid={dataUser._id} />
                </div>
            </div>

            {/* <div>
                <button className="cursor-pointer hover:text-primary">
                    <HiDotsVertical/>
                </button>
            </div> */}
        </header>

        {/* show all messages */}
        <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
            

            {/* All messages are shown here */}
            <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
                {
                    allMessage.map((msg,index)=>{
                        console.log(msg)
                        return(
                            <div key={index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${userValue._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                                <div className="w-full">
                                    {
                                        msg.imageUrl && (
                                            <img
                                                src={msg.imageUrl}
                                                className="w-full h-full object-state-down"
                                            />
                                        )
                                    }
                                </div>
                                <div className={`w-full ${msg.imageUrl ? "mt-1" : ""}`}>
                                    {
                                        msg.videoUrl && (
                                            <video
                                                src={msg.videoUrl}
                                                className="w-full h-full object-state-down"
                                                controls
                                            />
                                        )
                                    }
                                </div>
                                <p className="px-2">{msg.text}</p>
                                <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format('hh:mm')}</p>
                            </div>
                        )
                    })
                }
            </div>

            {/* Upload image display */}
            {
                message.imageUrl && (
                    <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                        <div className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-300" onClick={handleClearUploadImage}>
                            <IoClose size={30} />
                        </div>
                        <div className="bg-white p-3">
                            <img
                                src={message.imageUrl}
                                alt="uploadImage"
                                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                            />
                        </div>
                    </div>
                )
            }

            {/* Upload video display */}
            {
                message.videoUrl && (
                    <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                        <div className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-300" onClick={handleClearUploadVideo}>
                            <IoClose size={30} />
                        </div>
                        <div className="bg-white p-3">
                            <video
                                src={message.videoUrl}
                                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                                alt="uploadVideo"
                                controls
                                muted
                                autoPlay
                            />
                        </div>
                    </div>
                )
            }

            {loading && (
                <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
                    <Loading />
                </div>
            )}
        </section>

        {/* send message */}
        <section className="h-16 bg-white flex items-center px-4">
            <div className="relative">
                <button onClick={handleUploadImageVideoOpen} className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white">
                    <FaPlus size={20}/>
                </button>

                {/* video and image */}
                {
                    openImageVideoUpload && (
                        <div className="bg-white shadow rounded absolute bottom-16 w-36 p-2">
                            <form>
                                <label htmlFor="uploadImage" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor:pointer">
                                    <div className="text-primary">
                                        <FaImage size={18}/>
                                    </div>
                                    <p>Image</p>
                                </label>
                                <label htmlFor="uploadVideo" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor:pointer">
                                    <div className="text-purple-500">
                                        <FaVideo size={18}/>
                                    </div>
                                    <p>Video</p>
                                </label>

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    id="uploadImage"
                                    onChange={handleUploadImage}
                                    className="hidden"
                                />
                                <input
                                    type="file"
                                    accept=".mp4,.avi,.3gp,.wmv,.mov,.mkv,.webm"
                                    id="uploadVideo"
                                    onChange={handleUploadVideo}
                                    className="hidden"
                                />
                            </form>
                        </div>
                    )
                }
            </div>

            {/* input box */}
            <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
                <input 
                    type="text"
                    placeholder="Type your message here..."
                    className="py-1 px-4 outline-none w-full h-full"
                    value={message.text}
                    onChange={handleOnChangeText}
                />
                <button className="text-primary hover:text-secondary">
                    <IoMdSend size={28} />
                </button>
            </form>
        </section>
    </div>
}

const CheckStatus=({userid})=>{
    const onlineUser=useRecoilValue(onlineAtom);
    const isOnline = onlineUser.includes(userid);
    return <p className="-my-2 text-sm">
        {
            isOnline ? <span className="text-primary">online</span> : <span className="text-slate-400">offline</span>
        }
    </p>
}

export default MessagePage;
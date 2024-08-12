import { IoChatbubbleEllipses } from "react-icons/io5"
import { FaImage, FaUserPlus, FaVideo } from "react-icons/fa"
import { NavLink, useNavigate } from "react-router-dom"
import {BiLogOut} from "react-icons/bi"
import Avatar from "./Avatar"
import { useRecoilValue } from "recoil"
import { userAtom } from "../recoil/atoms"
import EditUserDetails from "./EditUserDetails"
import { useEffect, useState } from "react"
import {FiArrowUpLeft} from "react-icons/fi"
import SearchUser from "./SearchUser"
import { usesocket } from "../App"
import {Logout} from "../recoil/logout"
import toast from "react-hot-toast"
import axios from "axios"

const Sidebar=()=>{
    const userAtomValue=useRecoilValue(userAtom);
    const [editUserOpen,setEditUserOpen]=useState(false);
    const [allUser,setAllUser]=useState([])
    const [openSearchUser,setOpenSearchUser]=useState(false);
    const {socketConn}=usesocket();
    const navigate=useNavigate();

    useEffect(()=>{
        if(socketConn){
            socketConn.emit('sidebar',userAtomValue._id)

            socketConn.on('conversation',(data)=>{
                const conversationUserData = data.map((user,index)=>{

                    if(user?.sender?._id === user?.reciever?._id){
                        return{
                            ...user,
                            userDetails: user?.sender
                        }
                    }
                    else if(user?.reciever?._id !== userAtomValue?._id){
                        return{
                            ...user,
                            userDetails: user.reciever
                        }
                    }
                    else{
                        return{
                            ...user,
                            userDetails: user.sender
                        }
                    }
                })
                setAllUser(conversationUserData)
            })
        }
    },[socketConn,userAtomValue])
    // console.log("alluser",allUser);

    const handleLogOut=async ()=>{
        localStorage.clear();
        try{
            const URL=`${process.env.REACT_APP_BACKEND_URL}/api/logout`;
            const res= await axios({
                method: "get",
                url: URL,
                withCredentials: true
            })
        } catch(err){
            // console.log(err)
            toast.error("Error logging out")
        }
        <Logout/>
        navigate("/email");
        return;
    }

    return (
        <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
            <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
                <div>
                    <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses size={22}/>
                    </NavLink>

                    <div title="Add friend" onClick={()=>setOpenSearchUser(true)} className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
                        <FaUserPlus size={22}/>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <button className="mx-auto" title={userAtomValue?.name} onClick={()=>setEditUserOpen(true)}>
                        <Avatar
                            width={30}
                            height={30}
                            name={userAtomValue?.name}
                            ImageURL={userAtomValue?.profile_pic}
                            userId={userAtomValue?._id}
                        />
                    </button>
                    <button title="Logout" className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded" onClick={handleLogOut}>
                        <span className="-ml-1">
                            <BiLogOut size={22} />
                        </span>
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="h-16 flex items-center">
                    <h2 className="text-xl font-bold p-4 text-slate-800">Messages</h2>
                </div>
                <div className="bg-slate-200 p-[0.5px]"></div>

                <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
                    {allUser.length===0 && (
                        <div className="mt-12">
                            <div className="flex justify-center items-center my-4 text-slate-500">
                                <FiArrowUpLeft
                                    size={50}
                                />
                            </div>
                            <p className="text-lg text-center text-slate-400">Explore users to start a conversation with</p>
                        </div>
                    )
                    }

                    {
                        allUser.map((conv,index)=>{
                            return(
                                <NavLink to={"/message/"+conv?.userDetails?._id} key={conv?._id} className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer">
                                    <div>
                                        <Avatar
                                            ImageURL={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-ellipses line-clamp-1 font-semibold text-base">{conv.userDetails.name}</h3>
                                        <div className="text-slate-500 text-xs flex items-center gap-1">
                                            <div className="flex items-center gap-1">
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className="flex items-center gap-1">
                                                            <span><FaImage/></span>
                                                            {!conv?.lastMsg?.text && <span>Image</span>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className="flex items-center gap-1">
                                                            <span><FaVideo/></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {
                                        conv?.unseenMsg>0 && (
                                            <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">{conv?.unseenMsg<=99 ? conv?.unseenMsg : "99+"}</p>
                                        )
                                    }       
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>

            {/* edit user details */}
            {
                editUserOpen && (
                    <EditUserDetails onClose={()=>setEditUserOpen(false)} user={userAtomValue}/>
                )
            }

            {/* search user */}
            {
                openSearchUser && (
                    <SearchUser onClose={()=>setOpenSearchUser(false)}/>
                )
            }

        </div>
    )
}

export default Sidebar
import { useEffect, useRef, useState } from "react"
import Avatar from "./Avatar"
import uploadFile from "../../helper/uploadFile"
import Divider from "./Divider"
import axios from "axios"
import toast from "react-hot-toast"
import { useRecoilState} from "recoil"
import { userAtom } from "../recoil/atoms"

const EditUserDetails=({onClose,user})=>{
    const [data,setData]=useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })
    const uploadPhotoRef=useRef()
    const [userAtomValue,setuserAtomValue]=useRecoilState(userAtom)
    
    const handleOnChange=(e)=>{
        const {name,value}=e.target

        setData((prev)=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadPhoto=async (e)=>{
        const file=e.target.files[0];
        
        if(!file || !file.type.startsWith('image/')){
            toast.error("Please select a valid image type")
        }
        else{
            const uploadPhoto=await uploadFile(file)
            setData((prev)=>{
                return{
                    ...prev,
                    profile_pic: uploadPhoto?.url
                }
            })
        }
    }

    const handleSubmit=async (e)=>{
        try{
            const URL=`${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const res=await axios({
                method:'put',
                url: URL,
                data: data,
                withCredentials:true
            })
            console.log(res)
            toast.success(res.data.message)
            if(res.data.success){
                setuserAtomValue({...userAtomValue, name:data.name, profile_pic:data.profile_pic})
                onClose();
            } 
        } catch(err){
            toast.error(err?.res?.data?.message)
        }
    }

    const handleOpenUploadPhoto=(e)=>{
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
            <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
                <h2 className="font-semibold">Profile details</h2>
                <p className="text-sm">Edit user details</p>

                <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={handleOnChange}
                            className="w-full py-1 px-2 focus:outline-primary border-0.5 "
                        ></input>
                    </div>

                    <div>
                        <div>Photo:</div>
                        <div className="my-1 flex items-center gap-4">
                            <Avatar
                                width={40}
                                height={40}
                                ImageURL={data?.profile_pic}
                                name={data?.name}
                             />
                             <label htmlFor="profile_pic">
                             <button className="font-semibold" onClick={handleOpenUploadPhoto}>Change photo</button>
                             <input
                                type='file'
                                accept=".jpg,.jpeg,.png"
                                id="profile_pic"
                                className="hidden"
                                onChange={handleUploadPhoto}
                                ref={uploadPhotoRef}
                              />
                              </label>
                        </div>
                    </div>

                    <Divider/>
                    <div className="flex gap-2 w-fit ml-auto">
                        <button type="button" onClick={onClose} className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white">Cancel</button>
                        <button className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserDetails
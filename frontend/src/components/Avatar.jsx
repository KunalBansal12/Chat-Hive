import { PiUserCircle } from "react-icons/pi";
import { useRecoilValue } from "recoil";
import { onlineAtom } from "../recoil/atoms";
import { memo } from "react";

const Avatar=memo(({userId,name,ImageURL,width,height})=>{
    // const onlineUser=useRecoilValue(onlineAtom);

    let avatarName=""

    if(name){
        const splitname = name?.split(" ");
        if(splitname.length>1){
            avatarName = splitname[0][0]+ splitname[1][0];
        }
        else{
            avatarName=splitname[0][0];
        }
    }

    const bgColor=[
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-gray-200',
        'bg-cyan-200',
        'bg-sky-200',
        'bg-blue-200',
    ]

    const randomnum=Math.floor(Math.random()*9);

    // const isOnline = onlineUser.includes(userId)

    return <div className={`text-slate-800 rounded-full font-bold relative`} style={{width: width+"px", height: height+"px"}}>
        {
            ImageURL ? (
                <div style={{ width: width + "px", height: height + "px" }} className="overflow-hidden rounded-full">
                    <img
                        src={ImageURL}
                        alt={name}
                        className="object-cover w-full h-full"
                    />
                </div>
            ) : (
                name ? (
                    <div style={{width: width+"px", height: height+"px"}} className={`overflow-hidden rounded-full text-lg ${bgColor[randomnum]} flex justify-center items-center`}>
                        {avatarName}
                    </div>
                ) : (
                    <PiUserCircle size={width} />
                )
            )
        }

        {/* {isOnline && (
            <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>
        )} */}
        <CheckStatus userid={userId} />
    </div>
})

const CheckStatus=({userid})=>{
    const onlineUser=useRecoilValue(onlineAtom);
    const isOnline = onlineUser.includes(userid);
    return <>
        {
            isOnline ? <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div> : <></>
        }
    </>
}

export default Avatar;
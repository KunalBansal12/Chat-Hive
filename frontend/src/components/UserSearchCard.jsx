import { Link } from "react-router-dom"
import Avatar from "./Avatar"

const UserSearchCard=({user,onClose})=>{
    return <Link to={"/message/"+user?._id} onClick={onClose} className="flex items-center gap-3 overflow-hidden p-2 lg:pd-4 border border-transparent border-b-slate-200 hover:border-primary rounded cursor-pointer">
        <div>
            <Avatar 
                width={50}
                height={50}
                name={user?.name}
                userId={user?._id}
                ImageURL={user?.profile_pic}
            />
        </div>
        <div>
            <div className="font-semibold text-ellipsis line-clamp-1">
                {user?.name}
            </div>
            <p className="text-sm text-ellipsis line-clamp-1">{user.email}</p>
        </div>
    </Link>
}

export default UserSearchCard
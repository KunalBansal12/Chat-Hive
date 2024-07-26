import { useSetRecoilState } from "recoil";
import { onlineAtom, tokenAtom, userAtom } from "./atoms";
import { usesocket } from "../App";

export const Logout=()=>{
    const setAtomValue=useSetRecoilState(userAtom)
    const setTokenValue=useSetRecoilState(tokenAtom)
    const setOnlineAtom=useSetRecoilState(onlineAtom)
    const {setSocketConn}=usesocket();

    setAtomValue({
        _id: "",
        name: "",
        email: "",
        profile_pic: "",
    })
    setTokenValue("")
    setOnlineAtom([])
    setSocketConn(null)
}
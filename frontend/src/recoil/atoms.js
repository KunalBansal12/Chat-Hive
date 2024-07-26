import {atom} from "recoil"

export const userAtom=atom({
    key: "userAtom",
    default: {
        _id: "",
        name: "",
        email: "",
        profile_pic: "",
    }
})

export const tokenAtom=atom({
    key: "tokenAtom",
    default: ""
})

export const onlineAtom=atom({
    key: "onlineAtom",
    default: []
})
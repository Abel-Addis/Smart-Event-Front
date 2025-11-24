import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore=defineStore('user',()=>{
    const token=ref(localStorage.getItem('token')||null)
    const user=ref(null)

    const getToken=computed(()=> token.value)
    function setUser(data){
        token.value=data.token
        user.value=data
        localStorage.setItem('token',data.token)
    }
    function logout(){
        token.value=null
        user.value=null
        localStorage.removeItem('token')
    }
    return{token,getToken,setUser,logout,user}
})
import { ref } from "vue";
import { login } from "../api/auth";
import { useUserStore } from "../store/user";

export default function useLogin() {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const message = ref("");
  const success = ref(null);
  console.log("useLogin initialized");
  const log = async (credentials) => {
    console.log("log() called with:", credentials);
    try {
      loading.value = true;
      error.value = null;
      message.value = "";
      success.value = null;
      const response = await login(credentials);
      console.log("success status", response);
      if (response.success) {
        localStorage.setItem("token", response.token);
        data.value = response;
        const userStore=useUserStore()
        userStore.setUser(response)
        message.value = response.message;
        success.value = response.success;
      } else {
        success.value=false
        error.value = response.message;
      }
    } catch (err) {
      console.error(`Login API threw:`, err); 
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  return { data, loading, error, message, log, success };
}

import { ref } from "vue";
import { register } from "../api/auth";
import { useUserStore } from "../store/user";

export default function useRegister() {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const success = ref(null);
  const message = ref("");

  const registerUser = async (userData) => {
    error.value = null;
    success.value = null;
    try {
      loading.value = true;
      const response = await register(userData);
      if (response.success) {
        localStorage.setItem("token", response.token);
        data.value = response;
        const userStore = useUserStore()
        userStore.setUser(response);
        success.value = response.success;
        message.value = response.message;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  return { data, registerUser, message, success, error };
}

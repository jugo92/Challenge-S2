import {ref} from "vue";

const isRouteAdmin = ref(false);
export const checkIsRouteAdmin = () => {
    if (window.location.pathname.includes('admin')) {
        isRouteAdmin.value = true;
    }else{
        isRouteAdmin.value = false;
    }
    return isRouteAdmin.value;
}


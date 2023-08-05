import { defineStore } from 'pinia';
import axios from 'axios';
import functions from '@/assets/ts/functions';
if(process.client) {
  axios.defaults.headers.common['Authorization'] = functions.getCookie('token') || '';
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: process.client ? functions.getCookie('token') || '' : '',
    currentUser: {},
    error: ''
  }),

  getters: {
    isLoggedIn: state => !!state.token,
  },
  
  actions: {
    async login(user: object, checkbox: boolean) {
      try {
        const res: any = await axios.post(`${useRuntimeConfig().apiBase}/users/login`, user);
        if(res.data.success) {
          const token = res.data.token;
          if(checkbox == true) {
            functions.setCookie('token', token, 365);
          } else {
            functions.setCookie('token', token);
          }
          this.token = token;
          axios.defaults.headers.common['Authorization'] = token;
          this.currentUser = user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async register(user: object) {
      try {
        const res: any = await axios.post(`${useRuntimeConfig().apiBase}/users/register`, user);
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
      }
    },

    async getCurrentUser() {
      try {
        const res: any = await axios.get(`${useRuntimeConfig().apiBase}/users/currentuser`);
        if(res.data.success) {
          this.$state.currentUser = res.data.user;
        }
        return res;
      } catch(err: any) {
        this.$state.error = err.response.data.message;
        if(process.client && err.response.status != 429) {
          functions.deleteCookie('token');
        }
      }
    }
  },
});

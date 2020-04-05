const axios = require("axios");
const wsse = require('wsse');

class Phenix {
  constructor({ email, password }) {
    this.request = axios.create({
      baseURL: "https://app.wearephenix.com/api/v4",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "fr-FR",
      },
    });

    this.email = email;
    this.password = password;
    this.profile = null;
    this.token = null;
    this.accessToken = null;

    this.request.interceptors.request.use(
      (axiosConfig) => {
        if (axiosConfig.url !== "/public/oauth/login_email") {
          Object.assign(axiosConfig.headers, {
            'x-wsse': this.token.getWSSEHeader({ nonceBase64: true })
          });
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  setToken(hashedPassword) {
    this.token = wsse.default({ username: this.email, password: hashedPassword });
  }

  setProfile(profile) {
    this.profile = profile;
  }

  async login() {
    try {
      const response = await this.request({
        url: "/public/oauth/login_email",
        method: "POST",
        data: {
          username: this.email,
          password: this.password,
          locale: "fr"
        },
      });
      const { user_data: { password, ...rest } } = response.data;
      this.setToken(password);
      this.setProfile(rest);
      return response.data;
    } catch (err) {
      console.log("error with login", err);
    }
  }

  getProfile() {
    return this.profile;
  }

  async getStores({ latitude, longitude }, radius = 2000) {
    try {
      const response = await this.request({
        url: "/user/all_advertiser",
        method: "POST",
        data: {
          latitude: latitude,
          longitude: longitude,
          max_distance: radius,
          lang: 'fr',
          add_extra: false,
          add_order: false,
          pickup_start_hour: 6,
          pickup_end_hour: 23,
          only_available: true,
          width: 375
        }
      });
      return response.data;
    } catch (err) {
      console.log("error with getStores", err);
    }
  }
}

module.exports = Phenix;

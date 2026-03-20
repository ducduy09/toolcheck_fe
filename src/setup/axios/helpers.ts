/**
 * helper.js - for storing reusable logic.
 */
import axios from 'axios';
import Status from './Status';
import { SEARCH_URL } from './urls';
import { hideLoading, showLoading } from '@component/loading/LoadingModal';
import { showNetworkError } from '@component/modal/NetworkErrorModal';

const CancelToken = axios.CancelToken;

const TIMEOUT_MESSAGE = 'TIMEOUT';
const TIMEOUT = 30 * 60 * 1000;
const HEIGHTTIMEOUT = 30 * 60 * 1000;

export const DEPLOY_URL = 'http://localhost:8080/';
// export const DEPLOY_URL = 'https://server-warehouse.mkb-tech.vn/';
// export const DEPLOY_DOWNLOAD_URL = 'http://salesappapiuat.tpb.vn/upload/';

let BASE_URL = DEPLOY_URL;
// export let DOWNLOAD_URL = DEPLOY_DOWNLOAD_URL;

export const setDevMode = (isDev: boolean) => {
  // if (isDev) {
  //   BASE_URL = TEST_URL;
  //   BASE_URL_IMAGE = TEST_URL_IMAGE;
  //   DOWNLOAD_URL = TEST_URL_IMAGE_UPLOADED;
  // } else {
    BASE_URL = DEPLOY_URL;
    // DOWNLOAD_URL = DEPLOY_DOWNLOAD_URL;
  // }

  ApiClient.instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
  });
};

const axiosInit = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

class ApiClient {
  static instance: any;

  constructor(_instance: any) {
    if (ApiClient.instance) {
      return ApiClient.instance;
    } else {
      ApiClient.instance = _instance;
    }
  }

  mapRequestCancel: Map<string, any> = new Map();

  /**
   * Mỗi thao tác giao tiếp client - server cần kiểm tra xem client user còn tồn tại hay không,
   * giải pháp tạm thời là call API kiểm tra user active mỗi khi gọi API
   * @param url Sử dụng để loại trừ trường hợp gọi API login
   */

  //get
  async fetch(
    url: string,
    data?: object,
    loading: boolean = false,
    isAuth = true,
  ) {
    // let isNoLoadingCheckActive = url === AUTH_URL.checkActive;

    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.get(url, {
        params: data || {},
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        // !isNoLoadingCheckActive && hideLoading();
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          // isNoLoadingCheckActive && hideLoading();
          return;
        }
        if (error.response?.status?.toString() === Status.UNAUTHORIZED) {
          showNetworkError(
            'unauthorized',
            () => {},
            undefined,
            undefined,
            true,
          );
          return;
        }
        this.showError();
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  async getData(
    url: string,
    data?: object,
    loading: boolean = false,
    isAuth = true,
  ) {

    const headers: Record<string, string> = {};

    loading && showLoading();
    const request = () =>
      ApiClient.instance.get(url, {
        params: data || {},
        headers,
        
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }
    );

    try {
      const response = await Promise.race([
        request(),
        new Promise((_, reject) =>
          setTimeout(() => reject(TIMEOUT_MESSAGE), TIMEOUT)
        ),
      ]);
      hideLoading();
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      // ❗ Token hết hạn
      hideLoading();
      return Promise.reject(error);
    }
  }
  //post
  async post(
    url: string,
    data?: object,
    loading: boolean = false,
    isAuth = true,
  ) {
    const headers = {
    };

    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.post(url, data, {
        headers: isAuth && headers,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          hideLoading();
          return;
        }
        if (error.response?.status?.toString() === Status.UNAUTHORIZED) {
          showNetworkError(
            'unauthorized',
            () => {},
            undefined,
            undefined,
            true,
          );
          return;
        }
        this.showError();
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  async postWithJson(
    url: string,
    data?: object | string | number,
    loading: boolean = false,
    heightTimeOut = true,
    isErrorPushNotification: boolean = true
  ) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    loading && showLoading();

    const request = () =>
      ApiClient.instance.post(url, data, {
        headers,
        
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      });

    try {
      const response = await Promise.race([
        request(),
        new Promise((_, reject) =>
          setTimeout(() => reject(TIMEOUT_MESSAGE), heightTimeOut ? HEIGHTTIMEOUT : TIMEOUT)
        ),
      ]);

      hideLoading();
      return response.data;

    } catch (error: any) {
      if (axios.isCancel(error)) return;
      hideLoading();
      if (isErrorPushNotification) {
        this.showError();
      }

      return Promise.reject(error);
    }
  }


  async postWidthJsonTracking(
    url: string,
    data?: object | string | number,
    loading: boolean = false,
    isAuth = true,
    // isApplicationJson?: boolean,
  ) {
    const headers = {
      'Content-Type': 'application/json',
    };

    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.post(url, data, {
        headers: isAuth && headers,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('REQUEST CANCEL ----->: ', error);
          hideLoading();
          return;
        }
        if (error.response?.status?.toString() === Status.UNAUTHORIZED) {
          return;
        }
        console.log(url + 'ERROR ---->', error.response);
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  async login(
    url: string,
    data?: object | string | number,
    loading: boolean = false,
  ) {
    loading && showLoading();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    try {
      const response: any = await Promise.race([
        ApiClient.instance.post(url, data, { headers,  }),
        new Promise((_, reject) => {
          setTimeout(() => reject(TIMEOUT_MESSAGE), TIMEOUT);
        }),
      ]);
      loading && hideLoading();
      return response.data;
    } catch (error: any) {
      loading && hideLoading();
      console.log("Login error:", error);
      return Promise.reject(error?.response ?? error);
    }
  }

  //post form data
  async postFormData(
    url: string,
    body: any,
    loading: boolean = false,
    isAuthLogin: boolean = false,
    loginBiometric?: boolean,
  ) {
    const headersLogin = {
      Authorization: 'Basic bW9iaWxlOjEyMzQ=', // Authorization nay phai fix cung khi login
    };

    const headers = {
    };

    let data = new FormData();
    Object.keys(body).forEach((key) => {
      if (body[key] instanceof Array) {
        body[key].forEach((value: any) => {
          data.append(`${key}[]`, value);
        });
      } else {
        data.append(key, body[key]);
      }
    });

    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.post(url, data, {
        headers: isAuthLogin ? headersLogin : headers,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch(async (error) => {
        console.log('error', error.response);
        if (axios.isCancel(error)) {
          hideLoading();
          return;
        }
        hideLoading();
        return Promise.reject(error);
      });
  }

  async postLogin(
    url: string,
    body: any,
    loading: boolean = false,
  ) {
    const headersLogin = {
      Authorization: 'Basic bW9iaWxlOjEyMzQ=', // Authorization nay phai fix cung khi login
    };

    let data = new FormData();
    Object.keys(body).forEach((key) => {
      if (body[key] instanceof Array) {
        body[key].forEach((value: any) => {
          data.append(`${key}[]`, value);
        });
      } else {
        data.append(key, body[key]);
      }
    });

    loading && showLoading();

    return Promise.race([
      ApiClient.instance.post(url, data, {
        headers: headersLogin,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch((error) => {
        console.log('error', error.response);
        if (axios.isCancel(error)) {
          hideLoading();
          return;
        }
        hideLoading();
        return new Promise((resolve, reject) => {
          reject(error.response);
        });
      });
  }

  //put
  async put(
    url: string,
    data?: object,
    loading: boolean = false,
    isAuth = true,
  ) {
    const headers = {
    };

    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.put(url, data, {
        headers: isAuth && headers,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          hideLoading();
          return;
        }
        if (error.response?.status?.toString() === Status.UNAUTHORIZED) {
          showNetworkError(
            'unauthorized',
            () => {},
            undefined,
            undefined,
            true,
          );
          return;
        }
        this.showError();
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  //delete
  async delete(url: string, loading: boolean = false, isAuth = true) {
    const headers = {
    };


    loading && showLoading();

    // this.checkActiveUser(url);

    return Promise.race([
      ApiClient.instance.delete(url, {
        headers: isAuth && headers,
        cancelToken: new CancelToken((cancel) => {
          this.mapRequestCancel.set(url, cancel);
        }),
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(TIMEOUT_MESSAGE);
        }, TIMEOUT);
      }),
    ])
      .then((response) => {
        hideLoading();
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('REQUEST CANCEL ----->', error.message);
          hideLoading();
          return;
        }
        if (error.response?.status?.toString() === Status.UNAUTHORIZED) {
          showNetworkError(
            'unauthorized',
            () => {},
            undefined,
            undefined,
            true,
          );
          return;
        }
        this.showError();
        console.log(url + 'ERROR ---->', error.response);
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  private showError() {
    hideLoading();
    setTimeout(() => {
      showNetworkError('serverErr');
    }, 300);
  }

  cancelRequest(url: string) {
    const cancel = this.mapRequestCancel.get(url);
    cancel && cancel();
  }

  // public async requestDownloadFile(
  //   fileUrl: string,
  //   fileName: string,
  //   progressCallback?: (percent?: number) => void,
  //   isRunProgress: boolean = true,
  // ) {
  //   // this.checkActiveUser(fileUrl);

  //   let dirs = RNBlobUtil.fs.dirs;
  //   let path = `${dirs.DocumentDir}/${fileName}`;
  //   RNBlobUtil.config({
  //     trusty: true,
  //     fileCache: true,
  //     path: path,
  //   })
  //     .fetch('GET', encodeURI(fileUrl))
  //     .progress((received: any, total: any) => {
  //       let receivedNum = Number(received);
  //       let totalNum = Number(total);
        
  //       if (!isNaN(receivedNum) && !isNaN(totalNum) && totalNum > 0) {
  //         let percent = Math.floor((receivedNum / totalNum) * 100);
  //         if (isRunProgress && progressCallback) {
  //           progressCallback(percent);
  //         } else if (!isRunProgress && percent < 100 && progressCallback) {
  //           progressCallback(percent);
  //         }
  //       }
  //     })
  //     .then((res: any) => {
  //       if (progressCallback) {
  //         progressCallback(100);
  //       }
  //     })
  //     .catch((err: any) => {
  //       return err;
  //     });
  // }

  // public async requestUploadFiles(
  //   url: string,
  //   body: any,
  //   loading: boolean = true,
  //   progressCallback?: (number: number) => void,
  // ) {
  //   // this.checkActiveUser(url);
  //   const token = await constants.getAccessToken();
  //   let urlRequest = `${BASE_URL}${url}`;
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     // 'Content-Type': 'multipart/form-data',
  //   };
  //   loading && showLoading();
  //   return RNBlobUtil.config({
  //     // trusty: true,
  //     timeout: 1000 * 60 * 5,
  //   })
  //     .fetch('POST', urlRequest, headers, body)
  //     .uploadProgress((written: number, total: number) => {
  //       var percent = Math.floor((written / total) * 100);
  //       console.log(percent);
        
  //       if (!!progressCallback) {
  //         progressCallback(percent);
  //       }
  //     })
  //     .then((resp: { data: string; }) => {
  //       console.log(resp);
        
  //       hideLoading();
  //       if (resp) {
  //         return JSON.parse(resp.data);
  //       } else {
  //         return null;
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log('========> err: ' + JSON.stringify(err));
  //       hideLoading();
  //     });
  // }

  // public async requestUploadPdf(
  //   url: string,
  //   body: any,
  //   progressCallback?: (number: number) => void,
  //   loading: boolean = true,
  // ) {
  //   // this.checkActiveUser(url);
  //   const token = await constants.getAccessToken();

  //   let urlRequest = `${BASE_URL}${url}`;
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     // 'Content-Type': 'multipart/form-data',
  //   };
  //   loading && showLoading();
  //   return RNBlobUtil.config({
  //     trusty: true,
  //     timeout: 1000 * 60 * 5,
  //   })
  //     .fetch('POST', urlRequest, headers, body)
  //     .progress((received: any, total: any) => {
  //       let receivedNum = Number(received);
  //       let totalNum = Number(total);
  //       if (!isNaN(receivedNum) && !isNaN(totalNum) && totalNum > 0) {
  //         let percent = Math.floor((receivedNum / totalNum) * 100);
  //         if (progressCallback) {
  //           progressCallback(percent);
  //         }
  //       }
  //     })
  //     .then((resp: any) => {
  //       if (resp) {
  //         loading && hideLoading();
  //         return resp;
  //       } else {
  //         loading && hideLoading();
  //         return null;
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log(err, 'err');
  //       console.log('========> err: ' + JSON.stringify(err));
  //       loading && hideLoading();
  //     });
  // }

  // public async deletePdf(
  //   url: string,
  //   body: any,
  // ) {
  //   // this.checkActiveUser(url);
  //   const token = await constants.getAccessToken();

  //   let urlRequest = `${BASE_URL}${url}`;
  //   const headers = {
  //     Authorization: `Bearer ${token}`,
  //     // 'Content-Type': 'multipart/form-data',
  //   };
  //   showLoading();
  //   return RNBlobUtil.config({
  //     trusty: true,
  //     timeout: 1000 * 60,
  //   })
  //     .fetch('POST', urlRequest, headers, body)
  //     .then((resp: { data: string; }) => {
  //       if (resp) {
  //         hideLoading();
  //         return JSON.parse(resp.data);
  //       } else {
  //         hideLoading();
  //         return null;
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log(err, 'err');
  //       console.log('========> err: ' + JSON.stringify(err));
  //       hideLoading();
  //     });
  // }
}

const Api = new ApiClient(axiosInit);
export default Api;


/* eslint-disable */

import EventBus from '@/ts/utils/EventBus';
import { Topics } from '../Enums';
import { clearIdentityLocalStorage, getJWT } from '../GlobalState';

export class WebApiBase {
  protected transformOptions = async (options: RequestInit): Promise<RequestInit> => {
    EventBus.emit(Topics.AjaxStart);

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${getJWT()}`,
    };
    return Promise.resolve(options);
  };

  protected transformResult = async (
    url: string,
    response: Response,
    processor: (response: Response) => Promise<any>,
  ): Promise<any> => {
    EventBus.emit(Topics.AjaxStop);
    if (response.status === 401) clearIdentityLocalStorage();

    const clonedResponse = response.clone();
    const content = await clonedResponse.text();
    const parsedContent = JSON.parse(content);

    const { toast } = parsedContent;
    if (toast) EventBus.emit(Topics.ToastEvent, toast);

    const { toasts } = parsedContent;
    if (toasts) EventBus.emit(Topics.MultiToastEvent, toasts);

    return processor(response);
  };
}

export class WebApiClient extends WebApiBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super();
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    login(body: LoginUserQuery | undefined): Promise<LoginResponse> {
        let url_ = this.baseUrl + "/api/authenticate/login";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processLogin(_response));
        });
    }

    protected processLogin(response: Response): Promise<LoginResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = LoginResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<LoginResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    register(body: CreateUserCommand | undefined): Promise<string> {
        let url_ = this.baseUrl + "/api/authenticate/register";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRegister(_response));
        });
    }

    protected processRegister(response: Response): Promise<string> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<string>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    registerAdmin(body: CreateUserCommand | undefined): Promise<ResultStringValueTuple> {
        let url_ = this.baseUrl + "/api/authenticate/register-admin";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRegisterAdmin(_response));
        });
    }

    protected processRegisterAdmin(response: Response): Promise<ResultStringValueTuple> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ResultStringValueTuple.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ResultStringValueTuple>(<any>null);
    }

    /**
     * @return Success
     */
    authenticate(id: string): Promise<void> {
        let url_ = this.baseUrl + "/api/authenticate/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processAuthenticate(_response));
        });
    }

    protected processAuthenticate(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    password(body: UpdatePasswordCommand | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/authenticate/password";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processPassword(_response));
        });
    }

    protected processPassword(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    registerOrg(body: CreateOrganizationCommand | undefined): Promise<ResultStringValueTuple> {
        let url_ = this.baseUrl + "/api/authenticate/register-org";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRegisterOrg(_response));
        });
    }

    protected processRegisterOrg(response: Response): Promise<ResultStringValueTuple> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ResultStringValueTuple.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ResultStringValueTuple>(<any>null);
    }

    /**
     * @return Success
     */
    checkUserCompany(): Promise<void> {
        let url_ = this.baseUrl + "/api/authenticate/check-user-company";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processCheckUserCompany(_response));
        });
    }

    protected processCheckUserCompany(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateUserProfile(body: UpdateUserCommand | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/authenticate/update-user-profile";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateUserProfile(_response));
        });
    }

    protected processUpdateUserProfile(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @return Success
     */
    userProfile(): Promise<UserProfileResponse> {
        let url_ = this.baseUrl + "/api/authenticate/user-profile";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUserProfile(_response));
        });
    }

    protected processUserProfile(response: Response): Promise<UserProfileResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = UserProfileResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<UserProfileResponse>(<any>null);
    }

    /**
     * @param refreshToken (optional) 
     * @param email (optional) 
     * @return Success
     */
    refreshToken(refreshToken: string | undefined, email: string | undefined): Promise<LoginResponse> {
        let url_ = this.baseUrl + "/api/authenticate/refresh-token?";
        if (refreshToken === null)
            throw new Error("The parameter 'refreshToken' cannot be null.");
        else if (refreshToken !== undefined)
            url_ += "refreshToken=" + encodeURIComponent("" + refreshToken) + "&";
        if (email === null)
            throw new Error("The parameter 'email' cannot be null.");
        else if (email !== undefined)
            url_ += "email=" + encodeURIComponent("" + email) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRefreshToken(_response));
        });
    }

    protected processRefreshToken(response: Response): Promise<LoginResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = LoginResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<LoginResponse>(<any>null);
    }

    /**
     * @param fileId (optional) 
     * @param extension (optional) 
     * @param rowId (optional) 
     * @param files (optional) 
     * @return Success
     */
    upload(fileId: string | undefined, extension: string | undefined, rowId: string | undefined, files: StringStringValuesKeyValuePair[] | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/storage/upload?";
        if (fileId === null)
            throw new Error("The parameter 'fileId' cannot be null.");
        else if (fileId !== undefined)
            url_ += "fileId=" + encodeURIComponent("" + fileId) + "&";
        if (extension === null)
            throw new Error("The parameter 'extension' cannot be null.");
        else if (extension !== undefined)
            url_ += "extension=" + encodeURIComponent("" + extension) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = new FormData();
        if (files === null || files === undefined)
            throw new Error("The parameter 'files' cannot be null.");
        else
            files.forEach(item_ => content_.append("files", item_.toString()));

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpload(_response));
        });
    }

    protected processUpload(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param fileId (optional) 
     * @param extension (optional) 
     * @param fileName (optional) 
     * @param contentType (optional) 
     * @return Success
     */
    download(fileId: string | undefined, extension: string | undefined, fileName: string | undefined, contentType: string | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/storage/download?";
        if (fileId === null)
            throw new Error("The parameter 'fileId' cannot be null.");
        else if (fileId !== undefined)
            url_ += "fileId=" + encodeURIComponent("" + fileId) + "&";
        if (extension === null)
            throw new Error("The parameter 'extension' cannot be null.");
        else if (extension !== undefined)
            url_ += "extension=" + encodeURIComponent("" + extension) + "&";
        if (fileName === null)
            throw new Error("The parameter 'fileName' cannot be null.");
        else if (fileName !== undefined)
            url_ += "fileName=" + encodeURIComponent("" + fileName) + "&";
        if (contentType === null)
            throw new Error("The parameter 'contentType' cannot be null.");
        else if (contentType !== undefined)
            url_ += "contentType=" + encodeURIComponent("" + contentType) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDownload(_response));
        });
    }

    protected processDownload(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param fileId (optional) 
     * @param extension (optional) 
     * @param fileName (optional) 
     * @return Success
     */
    preview(fileId: string | undefined, extension: string | undefined, fileName: string | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/storage/preview?";
        if (fileId === null)
            throw new Error("The parameter 'fileId' cannot be null.");
        else if (fileId !== undefined)
            url_ += "fileId=" + encodeURIComponent("" + fileId) + "&";
        if (extension === null)
            throw new Error("The parameter 'extension' cannot be null.");
        else if (extension !== undefined)
            url_ += "extension=" + encodeURIComponent("" + extension) + "&";
        if (fileName === null)
            throw new Error("The parameter 'fileName' cannot be null.");
        else if (fileName !== undefined)
            url_ += "fileName=" + encodeURIComponent("" + fileName) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processPreview(_response));
        });
    }

    protected processPreview(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param rowId (optional) 
     * @param body (optional) 
     * @return Success
     */
    delete(rowId: string | undefined, body: FileItem | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/storage/delete?";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json-patch+json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDelete(_response));
        });
    }

    protected processDelete(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createWorkbook(body: CreateWorkbookCommand | undefined): Promise<IdResponse> {
        let url_ = this.baseUrl + "/api/workbook/create-workbook";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processCreateWorkbook(_response));
        });
    }

    protected processCreateWorkbook(response: Response): Promise<IdResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = IdResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<IdResponse>(<any>null);
    }

    /**
     * @return Success
     */
    browseWorkbooks(): Promise<WorkbookDefinitionServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbook/browse-workbooks";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processBrowseWorkbooks(_response));
        });
    }

    protected processBrowseWorkbooks(response: Response): Promise<WorkbookDefinitionServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WorkbookDefinitionServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WorkbookDefinitionServiceCollectionResponse>(<any>null);
    }

    /**
     * @return Success
     */
    browseSiteWorkbooks(): Promise<WorkbookDefinitionServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbook/browse-site-workbooks";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processBrowseSiteWorkbooks(_response));
        });
    }

    protected processBrowseSiteWorkbooks(response: Response): Promise<WorkbookDefinitionServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WorkbookDefinitionServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WorkbookDefinitionServiceCollectionResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateWorkbook(body: UpdateWorkbookCommand | undefined): Promise<WorkbookDefinitionServiceDataResponse> {
        let url_ = this.baseUrl + "/api/workbook/update-workbook";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateWorkbook(_response));
        });
    }

    protected processUpdateWorkbook(response: Response): Promise<WorkbookDefinitionServiceDataResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WorkbookDefinitionServiceDataResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WorkbookDefinitionServiceDataResponse>(<any>null);
    }

    /**
     * @param id (optional) 
     * @return Success
     */
    deleteWorkbook(id: string | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbook/delete-workbook?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDeleteWorkbook(_response));
        });
    }

    protected processDeleteWorkbook(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param id (optional) 
     * @return Success
     */
    getWorkbook(id: string | undefined): Promise<WorkbookDefinitionServiceDataResponse> {
        let url_ = this.baseUrl + "/api/workbook/get-workbook?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetWorkbook(_response));
        });
    }

    protected processGetWorkbook(response: Response): Promise<WorkbookDefinitionServiceDataResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WorkbookDefinitionServiceDataResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WorkbookDefinitionServiceDataResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @return Success
     */
    getWorkbookPersons(workbookId: string | undefined): Promise<ApplicationUserDtoServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbook/get-workbook-persons?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetWorkbookPersons(_response));
        });
    }

    protected processGetWorkbookPersons(response: Response): Promise<ApplicationUserDtoServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ApplicationUserDtoServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ApplicationUserDtoServiceCollectionResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @return Success
     */
    requestNewRow(workbookId: string | undefined, viewId: string | undefined): Promise<{ [key: string]: any; }> {
        let url_ = this.baseUrl + "/api/workbooktable/request-new-row?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRequestNewRow(_response));
        });
    }

    protected processRequestNewRow(response: Response): Promise<{ [key: string]: any; }> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200) {
                result200 = {} as any;
                for (let key in resultData200) {
                    if (resultData200.hasOwnProperty(key))
                        (<any>result200)![key] = resultData200[key];
                }
            }
            else {
                result200 = <any>null;
            }
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<{ [key: string]: any; }>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @param body (optional) 
     * @return Success
     */
    saveNewRow(workbookId: string | undefined, viewId: string | undefined, body: { [key: string]: any; } | undefined): Promise<StampResponse> {
        let url_ = this.baseUrl + "/api/workbooktable/save-new-row?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processSaveNewRow(_response));
        });
    }

    protected processSaveNewRow(response: Response): Promise<StampResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = StampResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StampResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @param rowId (optional) 
     * @param body (optional) 
     * @return Success
     */
    updateRow(workbookId: string | undefined, viewId: string | undefined, rowId: string | undefined, body: { [key: string]: any; } | undefined): Promise<StampResponse> {
        let url_ = this.baseUrl + "/api/workbooktable/update-row?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateRow(_response));
        });
    }

    protected processUpdateRow(response: Response): Promise<StampResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = StampResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<StampResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param rowId (optional) 
     * @return Success
     */
    deleteRow(workbookId: string | undefined, rowId: string | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbooktable/delete-row?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDeleteRow(_response));
        });
    }

    protected processDeleteRow(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param viewId (optional) 
     * @param rowId (optional) 
     * @return Success
     */
    getRowLogs(viewId: string | undefined, rowId: string | undefined): Promise<RowLogDefinitionServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbooktable/get-row-logs?";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetRowLogs(_response));
        });
    }

    protected processGetRowLogs(response: Response): Promise<RowLogDefinitionServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = RowLogDefinitionServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<RowLogDefinitionServiceCollectionResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @param rowShortId (optional) 
     * @return Success
     */
    getRow(workbookId: string | undefined, viewId: string | undefined, rowShortId: string | undefined): Promise<{ [key: string]: any; }> {
        let url_ = this.baseUrl + "/api/workbooktable/get-row?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        if (rowShortId === null)
            throw new Error("The parameter 'rowShortId' cannot be null.");
        else if (rowShortId !== undefined)
            url_ += "rowShortId=" + encodeURIComponent("" + rowShortId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetRow(_response));
        });
    }

    protected processGetRow(response: Response): Promise<{ [key: string]: any; }> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (resultData200) {
                result200 = {} as any;
                for (let key in resultData200) {
                    if (resultData200.hasOwnProperty(key))
                        (<any>result200)![key] = resultData200[key];
                }
            }
            else {
                result200 = <any>null;
            }
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<{ [key: string]: any; }>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @param body (optional) 
     * @return Success
     */
    getRowItemsByIds(workbookId: string | undefined, viewId: string | undefined, body: string[] | undefined): Promise<TableResponse> {
        let url_ = this.baseUrl + "/api/workbooktable/get-row-items-by-ids?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetRowItemsByIds(_response));
        });
    }

    protected processGetRowItemsByIds(response: Response): Promise<TableResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = TableResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<TableResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param rowId (optional) 
     * @return Success
     */
    getRowFiles(workbookId: string | undefined, rowId: string | undefined): Promise<FileItem[]> {
        let url_ = this.baseUrl + "/api/workbooktable/get-row-files?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetRowFiles(_response));
        });
    }

    protected processGetRowFiles(response: Response): Promise<FileItem[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(FileItem.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileItem[]>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateRowFiles(body: UpdateRowFilesCommand | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbooktable/update-row-files";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateRowFiles(_response));
        });
    }

    protected processUpdateRowFiles(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param rowId (optional) 
     * @return Success
     */
    getRowPermission(workbookId: string | undefined, rowId: string | undefined): Promise<PermissionDto> {
        let url_ = this.baseUrl + "/api/workbooktable/get-row-permission?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (rowId === null)
            throw new Error("The parameter 'rowId' cannot be null.");
        else if (rowId !== undefined)
            url_ += "rowId=" + encodeURIComponent("" + rowId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetRowPermission(_response));
        });
    }

    protected processGetRowPermission(response: Response): Promise<PermissionDto> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PermissionDto.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PermissionDto>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateRowPermission(body: PermissionDto | undefined): Promise<ToastResponse> {
        let url_ = this.baseUrl + "/api/workbooktable/update-row-permission";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateRowPermission(_response));
        });
    }

    protected processUpdateRowPermission(response: Response): Promise<ToastResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ToastResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ToastResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    replaceColumnValue(body: ReplaceColumnValueCommand | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbooktable/replace-column-value";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processReplaceColumnValue(_response));
        });
    }

    protected processReplaceColumnValue(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createWorkbookView(body: CreateViewCommand | undefined): Promise<ViewDefinitionServiceDataResponse> {
        let url_ = this.baseUrl + "/api/workbookview/create-workbook-view";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processCreateWorkbookView(_response));
        });
    }

    protected processCreateWorkbookView(response: Response): Promise<ViewDefinitionServiceDataResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ViewDefinitionServiceDataResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ViewDefinitionServiceDataResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    copyWorkbookView(body: CopyViewCommand | undefined): Promise<ViewDefinitionServiceDataResponse> {
        let url_ = this.baseUrl + "/api/workbookview/copy-workbook-view";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processCopyWorkbookView(_response));
        });
    }

    protected processCopyWorkbookView(response: Response): Promise<ViewDefinitionServiceDataResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ViewDefinitionServiceDataResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ViewDefinitionServiceDataResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateWorkbookView(body: UpdateViewCommand | undefined): Promise<ViewDefinitionServiceDataResponse> {
        let url_ = this.baseUrl + "/api/workbookview/update-workbook-view";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateWorkbookView(_response));
        });
    }

    protected processUpdateWorkbookView(response: Response): Promise<ViewDefinitionServiceDataResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ViewDefinitionServiceDataResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ViewDefinitionServiceDataResponse>(<any>null);
    }

    /**
     * @param id (optional) 
     * @return Success
     */
    deleteWorkbookView(id: string | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbookview/delete-workbook-view?";
        if (id === null)
            throw new Error("The parameter 'id' cannot be null.");
        else if (id !== undefined)
            url_ += "id=" + encodeURIComponent("" + id) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDeleteWorkbookView(_response));
        });
    }

    protected processDeleteWorkbookView(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    addWorkbookProperty(body: ViewDefinition | undefined): Promise<PropertyChangeResponse> {
        let url_ = this.baseUrl + "/api/workbookview/add-workbook-property";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processAddWorkbookProperty(_response));
        });
    }

    protected processAddWorkbookProperty(response: Response): Promise<PropertyChangeResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PropertyChangeResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PropertyChangeResponse>(<any>null);
    }

    /**
     * @param columnDataField (optional) 
     * @param body (optional) 
     * @return Success
     */
    deleteWorkbookProperty(columnDataField: string | undefined, body: ViewDefinition | undefined): Promise<PropertyChangeResponse> {
        let url_ = this.baseUrl + "/api/workbookview/delete-workbook-property?";
        if (columnDataField === null)
            throw new Error("The parameter 'columnDataField' cannot be null.");
        else if (columnDataField !== undefined)
            url_ += "columnDataField=" + encodeURIComponent("" + columnDataField) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDeleteWorkbookProperty(_response));
        });
    }

    protected processDeleteWorkbookProperty(response: Response): Promise<PropertyChangeResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PropertyChangeResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PropertyChangeResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param body (optional) 
     * @return Success
     */
    updateWorkbookProperty(workbookId: string | undefined, body: PropertyDefinition | undefined): Promise<PropertyDefinitionServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbookview/update-workbook-property?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateWorkbookProperty(_response));
        });
    }

    protected processUpdateWorkbookProperty(response: Response): Promise<PropertyDefinitionServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PropertyDefinitionServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PropertyDefinitionServiceCollectionResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param body (optional) 
     * @return Success
     */
    updateRelatedProperty(workbookId: string | undefined, body: PropertyDefinition | undefined): Promise<PropertyDefinitionServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workbookview/update-related-property?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateRelatedProperty(_response));
        });
    }

    protected processUpdateRelatedProperty(response: Response): Promise<PropertyDefinitionServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PropertyDefinitionServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PropertyDefinitionServiceCollectionResponse>(<any>null);
    }

    /**
     * @param workbookId (optional) 
     * @param viewId (optional) 
     * @param dataField (optional) 
     * @return Success
     */
    duplicateWorkbookProperty(workbookId: string | undefined, viewId: string | undefined, dataField: string | undefined): Promise<PropertyChangeResponse> {
        let url_ = this.baseUrl + "/api/workbookview/duplicate-workbook-property?";
        if (workbookId === null)
            throw new Error("The parameter 'workbookId' cannot be null.");
        else if (workbookId !== undefined)
            url_ += "workbookId=" + encodeURIComponent("" + workbookId) + "&";
        if (viewId === null)
            throw new Error("The parameter 'viewId' cannot be null.");
        else if (viewId !== undefined)
            url_ += "viewId=" + encodeURIComponent("" + viewId) + "&";
        if (dataField === null)
            throw new Error("The parameter 'dataField' cannot be null.");
        else if (dataField !== undefined)
            url_ += "dataField=" + encodeURIComponent("" + dataField) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "POST",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDuplicateWorkbookProperty(_response));
        });
    }

    protected processDuplicateWorkbookProperty(response: Response): Promise<PropertyChangeResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PropertyChangeResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PropertyChangeResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateViewsOrder(body: string[] | undefined): Promise<Result> {
        let url_ = this.baseUrl + "/api/workbookview/update-views-order";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateViewsOrder(_response));
        });
    }

    protected processUpdateViewsOrder(response: Response): Promise<Result> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = Result.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Result>(<any>null);
    }

    /**
     * @return Success
     */
    getWorkspaceMembers(): Promise<WorkspaceMemberDtoServiceCollectionResponse> {
        let url_ = this.baseUrl + "/api/workspace/get-workspace-members";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGetWorkspaceMembers(_response));
        });
    }

    protected processGetWorkspaceMembers(response: Response): Promise<WorkspaceMemberDtoServiceCollectionResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = WorkspaceMemberDtoServiceCollectionResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<WorkspaceMemberDtoServiceCollectionResponse>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateWorkspaceMember(body: WorkspaceMemberDto | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/workspace/update-workspace-member";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json-patch+json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processUpdateWorkspaceMember(_response));
        });
    }

    protected processUpdateWorkspaceMember(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    deleteWorkspaceMember(body: WorkspaceMemberDto | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/workspace/delete-workspace-member";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json-patch+json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processDeleteWorkspaceMember(_response));
        });
    }

    protected processDeleteWorkspaceMember(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    inviteMembers(body: WorkspaceMemberDto[] | undefined): Promise<ToastResponse> {
        let url_ = this.baseUrl + "/api/workspace/invite-members";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json-patch+json",
                "Accept": "text/plain"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processInviteMembers(_response));
        });
    }

    protected processInviteMembers(response: Response): Promise<ToastResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ToastResponse.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ToastResponse>(<any>null);
    }
}

export enum AccessLevel {
    _0 = 0,
    _1 = 1,
    _2 = 2,
}

export class ApplicationUserDto implements IApplicationUserDto {
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;

    constructor(data?: IApplicationUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.firstName = _data["firstName"];
            this.lastName = _data["lastName"];
            this.email = _data["email"];
        }
    }

    static fromJS(data: any): ApplicationUserDto {
        data = typeof data === 'object' ? data : {};
        let result = new ApplicationUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["email"] = this.email;
        return data; 
    }
}

export interface IApplicationUserDto {
    id?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
}

export class ApplicationUserDtoServiceCollectionResponse implements IApplicationUserDtoServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: ApplicationUserDto[] | undefined;

    constructor(data?: IApplicationUserDtoServiceCollectionResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            if (Array.isArray(_data["collection"])) {
                this.collection = [] as any;
                for (let item of _data["collection"])
                    this.collection!.push(ApplicationUserDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ApplicationUserDtoServiceCollectionResponse {
        data = typeof data === 'object' ? data : {};
        let result = new ApplicationUserDtoServiceCollectionResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        if (Array.isArray(this.collection)) {
            data["collection"] = [];
            for (let item of this.collection)
                data["collection"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IApplicationUserDtoServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: ApplicationUserDto[] | undefined;
}

export class ColumnSetting implements IColumnSetting {
    columnId?: string | undefined;
    width?: number;
    allowEditing?: boolean;
    showInTheTable?: boolean;

    constructor(data?: IColumnSetting) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.columnId = _data["columnId"];
            this.width = _data["width"];
            this.allowEditing = _data["allowEditing"];
            this.showInTheTable = _data["showInTheTable"];
        }
    }

    static fromJS(data: any): ColumnSetting {
        data = typeof data === 'object' ? data : {};
        let result = new ColumnSetting();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["columnId"] = this.columnId;
        data["width"] = this.width;
        data["allowEditing"] = this.allowEditing;
        data["showInTheTable"] = this.showInTheTable;
        return data; 
    }
}

export interface IColumnSetting {
    columnId?: string | undefined;
    width?: number;
    allowEditing?: boolean;
    showInTheTable?: boolean;
}

export class CopyViewCommand implements ICopyViewCommand {
    viewId?: string;
    workbookId?: string;

    constructor(data?: ICopyViewCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.viewId = _data["viewId"];
            this.workbookId = _data["workbookId"];
        }
    }

    static fromJS(data: any): CopyViewCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CopyViewCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["viewId"] = this.viewId;
        data["workbookId"] = this.workbookId;
        return data; 
    }
}

export interface ICopyViewCommand {
    viewId?: string;
    workbookId?: string;
}

export class CreateOrganizationCommand implements ICreateOrganizationCommand {
    name?: string | undefined;
    address?: string | undefined;
    shortName?: string | undefined;

    constructor(data?: ICreateOrganizationCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.address = _data["address"];
            this.shortName = _data["shortName"];
        }
    }

    static fromJS(data: any): CreateOrganizationCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateOrganizationCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["address"] = this.address;
        data["shortName"] = this.shortName;
        return data; 
    }
}

export interface ICreateOrganizationCommand {
    name?: string | undefined;
    address?: string | undefined;
    shortName?: string | undefined;
}

export class CreateUserCommand implements ICreateUserCommand {
    email?: string | undefined;
    password?: string | undefined;
    repeatPassword?: string | undefined;
    company?: string | undefined;

    constructor(data?: ICreateUserCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.email = _data["email"];
            this.password = _data["password"];
            this.repeatPassword = _data["repeatPassword"];
            this.company = _data["company"];
        }
    }

    static fromJS(data: any): CreateUserCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["email"] = this.email;
        data["password"] = this.password;
        data["repeatPassword"] = this.repeatPassword;
        data["company"] = this.company;
        return data; 
    }
}

export interface ICreateUserCommand {
    email?: string | undefined;
    password?: string | undefined;
    repeatPassword?: string | undefined;
    company?: string | undefined;
}

export class CreateViewCommand implements ICreateViewCommand {
    name?: string | undefined;
    viewId?: string;
    workbookId?: string;

    constructor(data?: ICreateViewCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.viewId = _data["viewId"];
            this.workbookId = _data["workbookId"];
        }
    }

    static fromJS(data: any): CreateViewCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateViewCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["viewId"] = this.viewId;
        data["workbookId"] = this.workbookId;
        return data; 
    }
}

export interface ICreateViewCommand {
    name?: string | undefined;
    viewId?: string;
    workbookId?: string;
}

export class CreateWorkbookCommand implements ICreateWorkbookCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;

    constructor(data?: ICreateWorkbookCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.shortId = _data["shortId"];
            this.owner = _data["owner"];
            this.name = _data["name"];
            this.color = _data["color"];
            this.icon = _data["icon"];
            this.pending = _data["pending"];
            this.completed = _data["completed"];
            this.order = _data["order"];
            this.description = _data["description"];
            this.databaseName = _data["databaseName"];
            this.nextColumnId = _data["nextColumnId"];
            this.rowsTable = _data["rowsTable"];
            this.isHidden = _data["isHidden"];
            if (Array.isArray(_data["views"])) {
                this.views = [] as any;
                for (let item of _data["views"])
                    this.views!.push(ViewDefinition.fromJS(item));
            }
            if (Array.isArray(_data["columns"])) {
                this.columns = [] as any;
                for (let item of _data["columns"])
                    this.columns!.push(PropertyDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CreateWorkbookCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateWorkbookCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["shortId"] = this.shortId;
        data["owner"] = this.owner;
        data["name"] = this.name;
        data["color"] = this.color;
        data["icon"] = this.icon;
        data["pending"] = this.pending;
        data["completed"] = this.completed;
        data["order"] = this.order;
        data["description"] = this.description;
        data["databaseName"] = this.databaseName;
        data["nextColumnId"] = this.nextColumnId;
        data["rowsTable"] = this.rowsTable;
        data["isHidden"] = this.isHidden;
        if (Array.isArray(this.views)) {
            data["views"] = [];
            for (let item of this.views)
                data["views"].push(item.toJSON());
        }
        if (Array.isArray(this.columns)) {
            data["columns"] = [];
            for (let item of this.columns)
                data["columns"].push(item.toJSON());
        }
        return data; 
    }
}

export interface ICreateWorkbookCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;
}

export class FileItem implements IFileItem {
    id?: string;
    name?: string | undefined;
    isDirectory?: boolean;
    expanded?: boolean;
    size?: number;
    canDelete?: boolean;
    items?: FileItem[] | undefined;
    extension?: string | undefined;
    contentType?: string | undefined;
    createdOn?: Date;

    constructor(data?: IFileItem) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.name = _data["name"];
            this.isDirectory = _data["isDirectory"];
            this.expanded = _data["expanded"];
            this.size = _data["size"];
            this.canDelete = _data["canDelete"];
            if (Array.isArray(_data["items"])) {
                this.items = [] as any;
                for (let item of _data["items"])
                    this.items!.push(FileItem.fromJS(item));
            }
            this.extension = _data["extension"];
            this.contentType = _data["contentType"];
            this.createdOn = _data["createdOn"] ? new Date(_data["createdOn"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): FileItem {
        data = typeof data === 'object' ? data : {};
        let result = new FileItem();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["isDirectory"] = this.isDirectory;
        data["expanded"] = this.expanded;
        data["size"] = this.size;
        data["canDelete"] = this.canDelete;
        if (Array.isArray(this.items)) {
            data["items"] = [];
            for (let item of this.items)
                data["items"].push(item.toJSON());
        }
        data["extension"] = this.extension;
        data["contentType"] = this.contentType;
        data["createdOn"] = this.createdOn ? this.createdOn.toISOString() : <any>undefined;
        return data; 
    }
}

export interface IFileItem {
    id?: string;
    name?: string | undefined;
    isDirectory?: boolean;
    expanded?: boolean;
    size?: number;
    canDelete?: boolean;
    items?: FileItem[] | undefined;
    extension?: string | undefined;
    contentType?: string | undefined;
    createdOn?: Date;
}

export class IdResponse implements IIdResponse {
    status?: ResponseStatus;
    toast?: Toast;
    id?: string | undefined;

    constructor(data?: IIdResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.id = _data["id"];
        }
    }

    static fromJS(data: any): IdResponse {
        data = typeof data === 'object' ? data : {};
        let result = new IdResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["id"] = this.id;
        return data; 
    }
}

export interface IIdResponse {
    status?: ResponseStatus;
    toast?: Toast;
    id?: string | undefined;
}

export class LoginResponse implements ILoginResponse {
    status?: ResponseStatus;
    toast?: Toast;
    jtwToken?: string | undefined;
    validTo?: Date;
    refreshToken?: string | undefined;

    constructor(data?: ILoginResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.jtwToken = _data["jtwToken"];
            this.validTo = _data["validTo"] ? new Date(_data["validTo"].toString()) : <any>undefined;
            this.refreshToken = _data["refreshToken"];
        }
    }

    static fromJS(data: any): LoginResponse {
        data = typeof data === 'object' ? data : {};
        let result = new LoginResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["jtwToken"] = this.jtwToken;
        data["validTo"] = this.validTo ? this.validTo.toISOString() : <any>undefined;
        data["refreshToken"] = this.refreshToken;
        return data; 
    }
}

export interface ILoginResponse {
    status?: ResponseStatus;
    toast?: Toast;
    jtwToken?: string | undefined;
    validTo?: Date;
    refreshToken?: string | undefined;
}

export class LoginUserQuery implements ILoginUserQuery {
    email?: string | undefined;
    password?: string | undefined;
    remoteIpAddress?: string | undefined;

    constructor(data?: ILoginUserQuery) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.email = _data["email"];
            this.password = _data["password"];
            this.remoteIpAddress = _data["remoteIpAddress"];
        }
    }

    static fromJS(data: any): LoginUserQuery {
        data = typeof data === 'object' ? data : {};
        let result = new LoginUserQuery();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["email"] = this.email;
        data["password"] = this.password;
        data["remoteIpAddress"] = this.remoteIpAddress;
        return data; 
    }
}

export interface ILoginUserQuery {
    email?: string | undefined;
    password?: string | undefined;
    remoteIpAddress?: string | undefined;
}

export class PermissionDto implements IPermissionDto {
    id?: string;
    workbookId?: string;
    isShared?: boolean;
    permissions?: UserPermission[] | undefined;

    constructor(data?: IPermissionDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.workbookId = _data["workbookId"];
            this.isShared = _data["isShared"];
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(UserPermission.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PermissionDto {
        data = typeof data === 'object' ? data : {};
        let result = new PermissionDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["workbookId"] = this.workbookId;
        data["isShared"] = this.isShared;
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPermissionDto {
    id?: string;
    workbookId?: string;
    isShared?: boolean;
    permissions?: UserPermission[] | undefined;
}

export class PropertyChangeResponse implements IPropertyChangeResponse {
    status?: ResponseStatus;
    toast?: Toast;
    dataField?: string | undefined;
    data1?: ViewDefinition;
    data2?: WorkbookDefinition;

    constructor(data?: IPropertyChangeResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.dataField = _data["dataField"];
            this.data1 = _data["data1"] ? ViewDefinition.fromJS(_data["data1"]) : <any>undefined;
            this.data2 = _data["data2"] ? WorkbookDefinition.fromJS(_data["data2"]) : <any>undefined;
        }
    }

    static fromJS(data: any): PropertyChangeResponse {
        data = typeof data === 'object' ? data : {};
        let result = new PropertyChangeResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["dataField"] = this.dataField;
        data["data1"] = this.data1 ? this.data1.toJSON() : <any>undefined;
        data["data2"] = this.data2 ? this.data2.toJSON() : <any>undefined;
        return data; 
    }
}

export interface IPropertyChangeResponse {
    status?: ResponseStatus;
    toast?: Toast;
    dataField?: string | undefined;
    data1?: ViewDefinition;
    data2?: WorkbookDefinition;
}

export class PropertyDefinition implements IPropertyDefinition {
    columnDataType?: PropertyType;
    dataField?: string | undefined;
    caption?: string | undefined;
    dataType?: string | undefined;
    fixed?: boolean;
    fixedPosition?: string | undefined;
    relatedWorkbookId?: string;
    relatedPropertyDisplayType?: RelatedPropertyDisplayType;
    relatedPropertyAppendedStatusPropertyKey?: string | undefined;
    hideTheRelatedPropertyNameField?: boolean;
    readonly relatedPropertyCacheKey?: string | undefined;
    status?: Status[] | undefined;
    isShared?: boolean;
    permissions?: UserPermission[] | undefined;

    constructor(data?: IPropertyDefinition) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.columnDataType = _data["columnDataType"];
            this.dataField = _data["dataField"];
            this.caption = _data["caption"];
            this.dataType = _data["dataType"];
            this.fixed = _data["fixed"];
            this.fixedPosition = _data["fixedPosition"];
            this.relatedWorkbookId = _data["relatedWorkbookId"];
            this.relatedPropertyDisplayType = _data["relatedPropertyDisplayType"];
            this.relatedPropertyAppendedStatusPropertyKey = _data["relatedPropertyAppendedStatusPropertyKey"];
            this.hideTheRelatedPropertyNameField = _data["hideTheRelatedPropertyNameField"];
            (<any>this).relatedPropertyCacheKey = _data["relatedPropertyCacheKey"];
            if (Array.isArray(_data["status"])) {
                this.status = [] as any;
                for (let item of _data["status"])
                    this.status!.push(Status.fromJS(item));
            }
            this.isShared = _data["isShared"];
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(UserPermission.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PropertyDefinition {
        data = typeof data === 'object' ? data : {};
        let result = new PropertyDefinition();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["columnDataType"] = this.columnDataType;
        data["dataField"] = this.dataField;
        data["caption"] = this.caption;
        data["dataType"] = this.dataType;
        data["fixed"] = this.fixed;
        data["fixedPosition"] = this.fixedPosition;
        data["relatedWorkbookId"] = this.relatedWorkbookId;
        data["relatedPropertyDisplayType"] = this.relatedPropertyDisplayType;
        data["relatedPropertyAppendedStatusPropertyKey"] = this.relatedPropertyAppendedStatusPropertyKey;
        data["hideTheRelatedPropertyNameField"] = this.hideTheRelatedPropertyNameField;
        data["relatedPropertyCacheKey"] = this.relatedPropertyCacheKey;
        if (Array.isArray(this.status)) {
            data["status"] = [];
            for (let item of this.status)
                data["status"].push(item.toJSON());
        }
        data["isShared"] = this.isShared;
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPropertyDefinition {
    columnDataType?: PropertyType;
    dataField?: string | undefined;
    caption?: string | undefined;
    dataType?: string | undefined;
    fixed?: boolean;
    fixedPosition?: string | undefined;
    relatedWorkbookId?: string;
    relatedPropertyDisplayType?: RelatedPropertyDisplayType;
    relatedPropertyAppendedStatusPropertyKey?: string | undefined;
    hideTheRelatedPropertyNameField?: boolean;
    relatedPropertyCacheKey?: string | undefined;
    status?: Status[] | undefined;
    isShared?: boolean;
    permissions?: UserPermission[] | undefined;
}

export class PropertyDefinitionServiceCollectionResponse implements IPropertyDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: PropertyDefinition[] | undefined;

    constructor(data?: IPropertyDefinitionServiceCollectionResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            if (Array.isArray(_data["collection"])) {
                this.collection = [] as any;
                for (let item of _data["collection"])
                    this.collection!.push(PropertyDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): PropertyDefinitionServiceCollectionResponse {
        data = typeof data === 'object' ? data : {};
        let result = new PropertyDefinitionServiceCollectionResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        if (Array.isArray(this.collection)) {
            data["collection"] = [];
            for (let item of this.collection)
                data["collection"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IPropertyDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: PropertyDefinition[] | undefined;
}

export enum PropertyType {
    _0 = 0,
    _1 = 1,
    _2 = 2,
    _3 = 3,
    _4 = 4,
    _5 = 5,
    _6 = 6,
    _7 = 7,
    _8 = 8,
    _9 = 9,
    __1 = -1,
}

export enum RelatedPropertyDisplayType {
    _0 = 0,
    _1 = 1,
}

export class ReplaceColumnValueCommand implements IReplaceColumnValueCommand {
    workbookId?: string;
    propertyId?: string | undefined;
    oldValue?: string | undefined;
    newValue?: string | undefined;

    constructor(data?: IReplaceColumnValueCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.workbookId = _data["workbookId"];
            this.propertyId = _data["propertyId"];
            this.oldValue = _data["oldValue"];
            this.newValue = _data["newValue"];
        }
    }

    static fromJS(data: any): ReplaceColumnValueCommand {
        data = typeof data === 'object' ? data : {};
        let result = new ReplaceColumnValueCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["workbookId"] = this.workbookId;
        data["propertyId"] = this.propertyId;
        data["oldValue"] = this.oldValue;
        data["newValue"] = this.newValue;
        return data; 
    }
}

export interface IReplaceColumnValueCommand {
    workbookId?: string;
    propertyId?: string | undefined;
    oldValue?: string | undefined;
    newValue?: string | undefined;
}

export enum ResponseStatus {
    _0 = 0,
    _1 = 1,
    _2 = 2,
    _3 = 3,
}

export class Result implements IResult {
    status?: ResponseStatus;
    toast?: Toast;

    constructor(data?: IResult) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
        }
    }

    static fromJS(data: any): Result {
        data = typeof data === 'object' ? data : {};
        let result = new Result();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        return data; 
    }
}

export interface IResult {
    status?: ResponseStatus;
    toast?: Toast;
}

export class ResultStringValueTuple implements IResultStringValueTuple {

    constructor(data?: IResultStringValueTuple) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
    }

    static fromJS(data: any): ResultStringValueTuple {
        data = typeof data === 'object' ? data : {};
        let result = new ResultStringValueTuple();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        return data; 
    }
}

export interface IResultStringValueTuple {
}

export class RowLogDefinition implements IRowLogDefinition {
    shortId?: string | undefined;
    id?: string;
    stamp?: number;
    rowId?: string;
    user?: string | undefined;
    cellDataField?: string | undefined;
    cellName?: string | undefined;
    oldValue?: string | undefined;
    newValue?: string | undefined;
    date?: Date;

    constructor(data?: IRowLogDefinition) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.shortId = _data["shortId"];
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.rowId = _data["rowId"];
            this.user = _data["user"];
            this.cellDataField = _data["cellDataField"];
            this.cellName = _data["cellName"];
            this.oldValue = _data["oldValue"];
            this.newValue = _data["newValue"];
            this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): RowLogDefinition {
        data = typeof data === 'object' ? data : {};
        let result = new RowLogDefinition();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["shortId"] = this.shortId;
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["rowId"] = this.rowId;
        data["user"] = this.user;
        data["cellDataField"] = this.cellDataField;
        data["cellName"] = this.cellName;
        data["oldValue"] = this.oldValue;
        data["newValue"] = this.newValue;
        data["date"] = this.date ? this.date.toISOString() : <any>undefined;
        return data; 
    }
}

export interface IRowLogDefinition {
    shortId?: string | undefined;
    id?: string;
    stamp?: number;
    rowId?: string;
    user?: string | undefined;
    cellDataField?: string | undefined;
    cellName?: string | undefined;
    oldValue?: string | undefined;
    newValue?: string | undefined;
    date?: Date;
}

export class RowLogDefinitionServiceCollectionResponse implements IRowLogDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: RowLogDefinition[] | undefined;

    constructor(data?: IRowLogDefinitionServiceCollectionResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            if (Array.isArray(_data["collection"])) {
                this.collection = [] as any;
                for (let item of _data["collection"])
                    this.collection!.push(RowLogDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): RowLogDefinitionServiceCollectionResponse {
        data = typeof data === 'object' ? data : {};
        let result = new RowLogDefinitionServiceCollectionResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        if (Array.isArray(this.collection)) {
            data["collection"] = [];
            for (let item of this.collection)
                data["collection"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IRowLogDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: RowLogDefinition[] | undefined;
}

export class StampResponse implements IStampResponse {
    status?: ResponseStatus;
    toast?: Toast;
    stamp?: number;

    constructor(data?: IStampResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.stamp = _data["stamp"];
        }
    }

    static fromJS(data: any): StampResponse {
        data = typeof data === 'object' ? data : {};
        let result = new StampResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["stamp"] = this.stamp;
        return data; 
    }
}

export interface IStampResponse {
    status?: ResponseStatus;
    toast?: Toast;
    stamp?: number;
}

export class Status implements IStatus {
    name?: string | undefined;
    color?: string | undefined;

    constructor(data?: IStatus) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.color = _data["color"];
        }
    }

    static fromJS(data: any): Status {
        data = typeof data === 'object' ? data : {};
        let result = new Status();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["color"] = this.color;
        return data; 
    }
}

export interface IStatus {
    name?: string | undefined;
    color?: string | undefined;
}

export class StringStringValuesKeyValuePair implements IStringStringValuesKeyValuePair {
    key?: string | undefined;
    value?: string[];

    constructor(data?: IStringStringValuesKeyValuePair) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.key = _data["key"];
            if (Array.isArray(_data["value"])) {
                this.value = [] as any;
                for (let item of _data["value"])
                    this.value!.push(item);
            }
        }
    }

    static fromJS(data: any): StringStringValuesKeyValuePair {
        data = typeof data === 'object' ? data : {};
        let result = new StringStringValuesKeyValuePair();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["key"] = this.key;
        if (Array.isArray(this.value)) {
            data["value"] = [];
            for (let item of this.value)
                data["value"].push(item);
        }
        return data; 
    }
}

export interface IStringStringValuesKeyValuePair {
    key?: string | undefined;
    value?: string[];
}

export class TableResponse implements ITableResponse {
    totalCount?: number | undefined;
    data?: { [key: string]: any; }[] | undefined;

    constructor(data?: ITableResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.totalCount = _data["totalCount"];
            if (Array.isArray(_data["data"])) {
                this.data = [] as any;
                for (let item of _data["data"])
                    this.data!.push(item);
            }
        }
    }

    static fromJS(data: any): TableResponse {
        data = typeof data === 'object' ? data : {};
        let result = new TableResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["totalCount"] = this.totalCount;
        if (Array.isArray(this.data)) {
            data["data"] = [];
            for (let item of this.data)
                data["data"].push(item);
        }
        return data; 
    }
}

export interface ITableResponse {
    totalCount?: number | undefined;
    data?: { [key: string]: any; }[] | undefined;
}

export class Toast implements IToast {
    detail?: string | undefined;
    readonly severity?: string | undefined;
    summary?: string | undefined;
    life?: number;

    constructor(data?: IToast) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.detail = _data["detail"];
            (<any>this).severity = _data["severity"];
            this.summary = _data["summary"];
            this.life = _data["life"];
        }
    }

    static fromJS(data: any): Toast {
        data = typeof data === 'object' ? data : {};
        let result = new Toast();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["detail"] = this.detail;
        data["severity"] = this.severity;
        data["summary"] = this.summary;
        data["life"] = this.life;
        return data; 
    }
}

export interface IToast {
    detail?: string | undefined;
    severity?: string | undefined;
    summary?: string | undefined;
    life?: number;
}

export class ToastResponse implements IToastResponse {
    toast?: Toast;
    status?: ResponseStatus;

    constructor(data?: IToastResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.status = _data["status"];
        }
    }

    static fromJS(data: any): ToastResponse {
        data = typeof data === 'object' ? data : {};
        let result = new ToastResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["status"] = this.status;
        return data; 
    }
}

export interface IToastResponse {
    toast?: Toast;
    status?: ResponseStatus;
}

export class UpdatePasswordCommand implements IUpdatePasswordCommand {
    userName?: string | undefined;
    oldPassword?: string | undefined;
    newPassword?: string | undefined;

    constructor(data?: IUpdatePasswordCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userName = _data["userName"];
            this.oldPassword = _data["oldPassword"];
            this.newPassword = _data["newPassword"];
        }
    }

    static fromJS(data: any): UpdatePasswordCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdatePasswordCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userName"] = this.userName;
        data["oldPassword"] = this.oldPassword;
        data["newPassword"] = this.newPassword;
        return data; 
    }
}

export interface IUpdatePasswordCommand {
    userName?: string | undefined;
    oldPassword?: string | undefined;
    newPassword?: string | undefined;
}

export class UpdateRowFilesCommand implements IUpdateRowFilesCommand {
    workbookId?: string;
    rowId?: string;
    fileItems?: FileItem[] | undefined;

    constructor(data?: IUpdateRowFilesCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.workbookId = _data["workbookId"];
            this.rowId = _data["rowId"];
            if (Array.isArray(_data["fileItems"])) {
                this.fileItems = [] as any;
                for (let item of _data["fileItems"])
                    this.fileItems!.push(FileItem.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UpdateRowFilesCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateRowFilesCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["workbookId"] = this.workbookId;
        data["rowId"] = this.rowId;
        if (Array.isArray(this.fileItems)) {
            data["fileItems"] = [];
            for (let item of this.fileItems)
                data["fileItems"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IUpdateRowFilesCommand {
    workbookId?: string;
    rowId?: string;
    fileItems?: FileItem[] | undefined;
}

export class UpdateUserCommand implements IUpdateUserCommand {
    firstName?: string | undefined;
    lastName?: string | undefined;
    address?: string | undefined;

    constructor(data?: IUpdateUserCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.firstName = _data["firstName"];
            this.lastName = _data["lastName"];
            this.address = _data["address"];
        }
    }

    static fromJS(data: any): UpdateUserCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateUserCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["address"] = this.address;
        return data; 
    }
}

export interface IUpdateUserCommand {
    firstName?: string | undefined;
    lastName?: string | undefined;
    address?: string | undefined;
}

export class UpdateViewCommand implements IUpdateViewCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    isSystem?: boolean;
    workbookId?: string;
    name?: string | undefined;
    ownerEmail?: string | undefined;
    isShared?: boolean;
    order?: number;
    columnKeys?: string[] | undefined;
    allColumnsInOrder?: string[] | undefined;
    wrapCells?: boolean;
    columns?: PropertyDefinition[] | undefined;
    permissions?: UserPermission[] | undefined;
    columnSettings?: ColumnSetting[] | undefined;

    constructor(data?: IUpdateViewCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.shortId = _data["shortId"];
            this.isSystem = _data["isSystem"];
            this.workbookId = _data["workbookId"];
            this.name = _data["name"];
            this.ownerEmail = _data["ownerEmail"];
            this.isShared = _data["isShared"];
            this.order = _data["order"];
            if (Array.isArray(_data["columnKeys"])) {
                this.columnKeys = [] as any;
                for (let item of _data["columnKeys"])
                    this.columnKeys!.push(item);
            }
            if (Array.isArray(_data["allColumnsInOrder"])) {
                this.allColumnsInOrder = [] as any;
                for (let item of _data["allColumnsInOrder"])
                    this.allColumnsInOrder!.push(item);
            }
            this.wrapCells = _data["wrapCells"];
            if (Array.isArray(_data["columns"])) {
                this.columns = [] as any;
                for (let item of _data["columns"])
                    this.columns!.push(PropertyDefinition.fromJS(item));
            }
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(UserPermission.fromJS(item));
            }
            if (Array.isArray(_data["columnSettings"])) {
                this.columnSettings = [] as any;
                for (let item of _data["columnSettings"])
                    this.columnSettings!.push(ColumnSetting.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UpdateViewCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateViewCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["shortId"] = this.shortId;
        data["isSystem"] = this.isSystem;
        data["workbookId"] = this.workbookId;
        data["name"] = this.name;
        data["ownerEmail"] = this.ownerEmail;
        data["isShared"] = this.isShared;
        data["order"] = this.order;
        if (Array.isArray(this.columnKeys)) {
            data["columnKeys"] = [];
            for (let item of this.columnKeys)
                data["columnKeys"].push(item);
        }
        if (Array.isArray(this.allColumnsInOrder)) {
            data["allColumnsInOrder"] = [];
            for (let item of this.allColumnsInOrder)
                data["allColumnsInOrder"].push(item);
        }
        data["wrapCells"] = this.wrapCells;
        if (Array.isArray(this.columns)) {
            data["columns"] = [];
            for (let item of this.columns)
                data["columns"].push(item.toJSON());
        }
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item.toJSON());
        }
        if (Array.isArray(this.columnSettings)) {
            data["columnSettings"] = [];
            for (let item of this.columnSettings)
                data["columnSettings"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IUpdateViewCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    isSystem?: boolean;
    workbookId?: string;
    name?: string | undefined;
    ownerEmail?: string | undefined;
    isShared?: boolean;
    order?: number;
    columnKeys?: string[] | undefined;
    allColumnsInOrder?: string[] | undefined;
    wrapCells?: boolean;
    columns?: PropertyDefinition[] | undefined;
    permissions?: UserPermission[] | undefined;
    columnSettings?: ColumnSetting[] | undefined;
}

export class UpdateWorkbookCommand implements IUpdateWorkbookCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;

    constructor(data?: IUpdateWorkbookCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.shortId = _data["shortId"];
            this.owner = _data["owner"];
            this.name = _data["name"];
            this.color = _data["color"];
            this.icon = _data["icon"];
            this.pending = _data["pending"];
            this.completed = _data["completed"];
            this.order = _data["order"];
            this.description = _data["description"];
            this.databaseName = _data["databaseName"];
            this.nextColumnId = _data["nextColumnId"];
            this.rowsTable = _data["rowsTable"];
            this.isHidden = _data["isHidden"];
            if (Array.isArray(_data["views"])) {
                this.views = [] as any;
                for (let item of _data["views"])
                    this.views!.push(ViewDefinition.fromJS(item));
            }
            if (Array.isArray(_data["columns"])) {
                this.columns = [] as any;
                for (let item of _data["columns"])
                    this.columns!.push(PropertyDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): UpdateWorkbookCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateWorkbookCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["shortId"] = this.shortId;
        data["owner"] = this.owner;
        data["name"] = this.name;
        data["color"] = this.color;
        data["icon"] = this.icon;
        data["pending"] = this.pending;
        data["completed"] = this.completed;
        data["order"] = this.order;
        data["description"] = this.description;
        data["databaseName"] = this.databaseName;
        data["nextColumnId"] = this.nextColumnId;
        data["rowsTable"] = this.rowsTable;
        data["isHidden"] = this.isHidden;
        if (Array.isArray(this.views)) {
            data["views"] = [];
            for (let item of this.views)
                data["views"].push(item.toJSON());
        }
        if (Array.isArray(this.columns)) {
            data["columns"] = [];
            for (let item of this.columns)
                data["columns"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IUpdateWorkbookCommand {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;
}

export class UserPermission implements IUserPermission {
    userId?: string;
    canRead?: boolean;
    canWrite?: boolean;
    canDelete?: boolean;

    constructor(data?: IUserPermission) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userId = _data["userId"];
            this.canRead = _data["canRead"];
            this.canWrite = _data["canWrite"];
            this.canDelete = _data["canDelete"];
        }
    }

    static fromJS(data: any): UserPermission {
        data = typeof data === 'object' ? data : {};
        let result = new UserPermission();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userId"] = this.userId;
        data["canRead"] = this.canRead;
        data["canWrite"] = this.canWrite;
        data["canDelete"] = this.canDelete;
        return data; 
    }
}

export interface IUserPermission {
    userId?: string;
    canRead?: boolean;
    canWrite?: boolean;
    canDelete?: boolean;
}

export class UserProfileResponse implements IUserProfileResponse {
    status?: ResponseStatus;
    toast?: Toast;
    firstName?: string | undefined;
    lastName?: string | undefined;
    address?: string | undefined;

    constructor(data?: IUserProfileResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.firstName = _data["firstName"];
            this.lastName = _data["lastName"];
            this.address = _data["address"];
        }
    }

    static fromJS(data: any): UserProfileResponse {
        data = typeof data === 'object' ? data : {};
        let result = new UserProfileResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["firstName"] = this.firstName;
        data["lastName"] = this.lastName;
        data["address"] = this.address;
        return data; 
    }
}

export interface IUserProfileResponse {
    status?: ResponseStatus;
    toast?: Toast;
    firstName?: string | undefined;
    lastName?: string | undefined;
    address?: string | undefined;
}

export class ViewDefinition implements IViewDefinition {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    isSystem?: boolean;
    workbookId?: string;
    name?: string | undefined;
    ownerEmail?: string | undefined;
    isShared?: boolean;
    order?: number;
    columnKeys?: string[] | undefined;
    allColumnsInOrder?: string[] | undefined;
    wrapCells?: boolean;
    columns?: PropertyDefinition[] | undefined;
    permissions?: UserPermission[] | undefined;
    columnSettings?: ColumnSetting[] | undefined;

    constructor(data?: IViewDefinition) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.shortId = _data["shortId"];
            this.isSystem = _data["isSystem"];
            this.workbookId = _data["workbookId"];
            this.name = _data["name"];
            this.ownerEmail = _data["ownerEmail"];
            this.isShared = _data["isShared"];
            this.order = _data["order"];
            if (Array.isArray(_data["columnKeys"])) {
                this.columnKeys = [] as any;
                for (let item of _data["columnKeys"])
                    this.columnKeys!.push(item);
            }
            if (Array.isArray(_data["allColumnsInOrder"])) {
                this.allColumnsInOrder = [] as any;
                for (let item of _data["allColumnsInOrder"])
                    this.allColumnsInOrder!.push(item);
            }
            this.wrapCells = _data["wrapCells"];
            if (Array.isArray(_data["columns"])) {
                this.columns = [] as any;
                for (let item of _data["columns"])
                    this.columns!.push(PropertyDefinition.fromJS(item));
            }
            if (Array.isArray(_data["permissions"])) {
                this.permissions = [] as any;
                for (let item of _data["permissions"])
                    this.permissions!.push(UserPermission.fromJS(item));
            }
            if (Array.isArray(_data["columnSettings"])) {
                this.columnSettings = [] as any;
                for (let item of _data["columnSettings"])
                    this.columnSettings!.push(ColumnSetting.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ViewDefinition {
        data = typeof data === 'object' ? data : {};
        let result = new ViewDefinition();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["shortId"] = this.shortId;
        data["isSystem"] = this.isSystem;
        data["workbookId"] = this.workbookId;
        data["name"] = this.name;
        data["ownerEmail"] = this.ownerEmail;
        data["isShared"] = this.isShared;
        data["order"] = this.order;
        if (Array.isArray(this.columnKeys)) {
            data["columnKeys"] = [];
            for (let item of this.columnKeys)
                data["columnKeys"].push(item);
        }
        if (Array.isArray(this.allColumnsInOrder)) {
            data["allColumnsInOrder"] = [];
            for (let item of this.allColumnsInOrder)
                data["allColumnsInOrder"].push(item);
        }
        data["wrapCells"] = this.wrapCells;
        if (Array.isArray(this.columns)) {
            data["columns"] = [];
            for (let item of this.columns)
                data["columns"].push(item.toJSON());
        }
        if (Array.isArray(this.permissions)) {
            data["permissions"] = [];
            for (let item of this.permissions)
                data["permissions"].push(item.toJSON());
        }
        if (Array.isArray(this.columnSettings)) {
            data["columnSettings"] = [];
            for (let item of this.columnSettings)
                data["columnSettings"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IViewDefinition {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    isSystem?: boolean;
    workbookId?: string;
    name?: string | undefined;
    ownerEmail?: string | undefined;
    isShared?: boolean;
    order?: number;
    columnKeys?: string[] | undefined;
    allColumnsInOrder?: string[] | undefined;
    wrapCells?: boolean;
    columns?: PropertyDefinition[] | undefined;
    permissions?: UserPermission[] | undefined;
    columnSettings?: ColumnSetting[] | undefined;
}

export class ViewDefinitionServiceDataResponse implements IViewDefinitionServiceDataResponse {
    status?: ResponseStatus;
    toast?: Toast;
    data?: ViewDefinition;

    constructor(data?: IViewDefinitionServiceDataResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.data = _data["data"] ? ViewDefinition.fromJS(_data["data"]) : <any>undefined;
        }
    }

    static fromJS(data: any): ViewDefinitionServiceDataResponse {
        data = typeof data === 'object' ? data : {};
        let result = new ViewDefinitionServiceDataResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["data"] = this.data ? this.data.toJSON() : <any>undefined;
        return data; 
    }
}

export interface IViewDefinitionServiceDataResponse {
    status?: ResponseStatus;
    toast?: Toast;
    data?: ViewDefinition;
}

export class WorkbookDefinition implements IWorkbookDefinition {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;

    constructor(data?: IWorkbookDefinition) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.stamp = _data["stamp"];
            this.shortId = _data["shortId"];
            this.owner = _data["owner"];
            this.name = _data["name"];
            this.color = _data["color"];
            this.icon = _data["icon"];
            this.pending = _data["pending"];
            this.completed = _data["completed"];
            this.order = _data["order"];
            this.description = _data["description"];
            this.databaseName = _data["databaseName"];
            this.nextColumnId = _data["nextColumnId"];
            this.rowsTable = _data["rowsTable"];
            this.isHidden = _data["isHidden"];
            if (Array.isArray(_data["views"])) {
                this.views = [] as any;
                for (let item of _data["views"])
                    this.views!.push(ViewDefinition.fromJS(item));
            }
            if (Array.isArray(_data["columns"])) {
                this.columns = [] as any;
                for (let item of _data["columns"])
                    this.columns!.push(PropertyDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): WorkbookDefinition {
        data = typeof data === 'object' ? data : {};
        let result = new WorkbookDefinition();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["stamp"] = this.stamp;
        data["shortId"] = this.shortId;
        data["owner"] = this.owner;
        data["name"] = this.name;
        data["color"] = this.color;
        data["icon"] = this.icon;
        data["pending"] = this.pending;
        data["completed"] = this.completed;
        data["order"] = this.order;
        data["description"] = this.description;
        data["databaseName"] = this.databaseName;
        data["nextColumnId"] = this.nextColumnId;
        data["rowsTable"] = this.rowsTable;
        data["isHidden"] = this.isHidden;
        if (Array.isArray(this.views)) {
            data["views"] = [];
            for (let item of this.views)
                data["views"].push(item.toJSON());
        }
        if (Array.isArray(this.columns)) {
            data["columns"] = [];
            for (let item of this.columns)
                data["columns"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IWorkbookDefinition {
    id?: string;
    stamp?: number;
    shortId?: string | undefined;
    owner?: string | undefined;
    name?: string | undefined;
    color?: string | undefined;
    icon?: string | undefined;
    pending?: number;
    completed?: number;
    order?: number;
    description?: string | undefined;
    databaseName?: string | undefined;
    nextColumnId?: number;
    rowsTable?: string | undefined;
    isHidden?: boolean;
    views?: ViewDefinition[] | undefined;
    columns?: PropertyDefinition[] | undefined;
}

export class WorkbookDefinitionServiceCollectionResponse implements IWorkbookDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: WorkbookDefinition[] | undefined;

    constructor(data?: IWorkbookDefinitionServiceCollectionResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            if (Array.isArray(_data["collection"])) {
                this.collection = [] as any;
                for (let item of _data["collection"])
                    this.collection!.push(WorkbookDefinition.fromJS(item));
            }
        }
    }

    static fromJS(data: any): WorkbookDefinitionServiceCollectionResponse {
        data = typeof data === 'object' ? data : {};
        let result = new WorkbookDefinitionServiceCollectionResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        if (Array.isArray(this.collection)) {
            data["collection"] = [];
            for (let item of this.collection)
                data["collection"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IWorkbookDefinitionServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: WorkbookDefinition[] | undefined;
}

export class WorkbookDefinitionServiceDataResponse implements IWorkbookDefinitionServiceDataResponse {
    status?: ResponseStatus;
    toast?: Toast;
    data?: WorkbookDefinition;

    constructor(data?: IWorkbookDefinitionServiceDataResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            this.data = _data["data"] ? WorkbookDefinition.fromJS(_data["data"]) : <any>undefined;
        }
    }

    static fromJS(data: any): WorkbookDefinitionServiceDataResponse {
        data = typeof data === 'object' ? data : {};
        let result = new WorkbookDefinitionServiceDataResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        data["data"] = this.data ? this.data.toJSON() : <any>undefined;
        return data; 
    }
}

export interface IWorkbookDefinitionServiceDataResponse {
    status?: ResponseStatus;
    toast?: Toast;
    data?: WorkbookDefinition;
}

export class WorkspaceMemberDto implements IWorkspaceMemberDto {
    userEmail?: string | undefined;
    userId?: string | undefined;
    accessLevel?: AccessLevel;

    constructor(data?: IWorkspaceMemberDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userEmail = _data["userEmail"];
            this.userId = _data["userId"];
            this.accessLevel = _data["accessLevel"];
        }
    }

    static fromJS(data: any): WorkspaceMemberDto {
        data = typeof data === 'object' ? data : {};
        let result = new WorkspaceMemberDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["userEmail"] = this.userEmail;
        data["userId"] = this.userId;
        data["accessLevel"] = this.accessLevel;
        return data; 
    }
}

export interface IWorkspaceMemberDto {
    userEmail?: string | undefined;
    userId?: string | undefined;
    accessLevel?: AccessLevel;
}

export class WorkspaceMemberDtoServiceCollectionResponse implements IWorkspaceMemberDtoServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: WorkspaceMemberDto[] | undefined;

    constructor(data?: IWorkspaceMemberDtoServiceCollectionResponse) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.status = _data["status"];
            this.toast = _data["toast"] ? Toast.fromJS(_data["toast"]) : <any>undefined;
            if (Array.isArray(_data["collection"])) {
                this.collection = [] as any;
                for (let item of _data["collection"])
                    this.collection!.push(WorkspaceMemberDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): WorkspaceMemberDtoServiceCollectionResponse {
        data = typeof data === 'object' ? data : {};
        let result = new WorkspaceMemberDtoServiceCollectionResponse();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["status"] = this.status;
        data["toast"] = this.toast ? this.toast.toJSON() : <any>undefined;
        if (Array.isArray(this.collection)) {
            data["collection"] = [];
            for (let item of this.collection)
                data["collection"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IWorkspaceMemberDtoServiceCollectionResponse {
    status?: ResponseStatus;
    toast?: Toast;
    collection?: WorkspaceMemberDto[] | undefined;
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}

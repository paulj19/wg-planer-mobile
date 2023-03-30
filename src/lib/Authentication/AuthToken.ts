import debugPrint from "lib/util/debugPrint";
import { refreshExpiredAccessToken } from "../../api/AuthenticationRequests";
import * as storage from "../../util/storage/Store";

export default class AuthToken {
  _accessToken: string;
  _refreshToken: string;
  _idToken: string;
  _expiryDate: Date;
  _tokenType: string;
  _scope: string;

  constructor(
    _accessToken: string,
    _refreshToken: string,
    _idToken: string,
    _expires: number | Date,
    _tokenType: string,
    _scope: string
  ) {
    this.accessToken = _accessToken;
    this.refreshToken = _refreshToken;
    this.idToken = _idToken;
    this.expiryDate = _expires;
    this.tokenType = _tokenType;
    this.scope = _scope;
  }

  public static fromApiResponse(responseData: any): AuthToken {
    AuthToken.validateNotNull(responseData);
    return new AuthToken(
      responseData.access_token,
      responseData.refresh_token,
      responseData.id_token,
      responseData.expires_in,
      responseData.token_type,
      responseData.scope
    );
  }

  public static fromStorage(fields): AuthToken {
    AuthToken.validateNotNull(fields);
    return new AuthToken(
      fields._accessToken,
      fields._refreshToken,
      fields._idToken,
      new Date(fields._expiryDate),
      fields._tokenType,
      fields._scope
    );
  }

  private static computeTokenExpiryDate(
    dateNow: Date,
    expiresIn: number
  ): Date {
    dateNow.setSeconds(dateNow.getSeconds() + (expiresIn - 20));
    return dateNow;
  }

  public isAccessTokenNotExpired() {
    if (this.expiryDate.getTime() <= new Date().getTime()) {
      return false;
    }
    return true;
  }

  public save() {
    try {
      return storage.save("auth-token", this);
    } catch (e) {
      throw Error("Error saving AuthToken: " + e);
    }
  }

  public static async load(): Promise<AuthToken | null> {
    try {
      const authToken = await storage.load("auth-token");
      if (authToken) {
        return AuthToken.fromStorage(authToken);
      } else {
        return null;
      }
    } catch (e) {
      throw Error("Error loading AuthToken: " + e);
    }
  }

  public static async loadAndRefreshAccessTokenIfExpired(): Promise<AuthToken | null> {
    try {
      //why did you think typescript would not do something
      const authToken = await AuthToken.load();
      if (authToken) {
        if (authToken.isAccessTokenNotExpired()) {
          return authToken;
        }
        const newAuthToken = await refreshExpiredAccessToken(
          authToken.refreshToken
        );
        return newAuthToken;
      } else {
        return null;
      }
    } catch (e) {
      throw Error("Expired accessToken refresh failed: " + e);
    }
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  get expiryDate(): Date {
    return this._expiryDate;
  }

  get tokenType(): string {
    return this._tokenType;
  }

  get scope(): string {
    return this._scope;
  }

  set accessToken(value) {
    AuthToken.validateNotNull(value);
    this._accessToken = value;
  }

  set refreshToken(value) {
    AuthToken.validateNotNull(value);
    this._refreshToken = value;
  }

  set idToken(value) {
    AuthToken.validateNotNull(value);
    this._idToken = value;
  }

  set expiryDate(value: number | Date) {
    AuthToken.validateNotNull(value);
    if (value instanceof Date) {
      this._expiryDate = value;
    } else {
      this._expiryDate = AuthToken.computeTokenExpiryDate(new Date(), value);
    }
  }

  set tokenType(value) {
    AuthToken.validateNotNull(value);
    this._tokenType = value;
  }

  set scope(value) {
    AuthToken.validateNotNull(value);
    this._scope = value;
  }

  private static validateNotNull(value: any) {
    //TODO change and test empty string etc..
    //TODO meaningful msg
    if (!value) {
      throw Error("value must not be null");
    }
  }
}

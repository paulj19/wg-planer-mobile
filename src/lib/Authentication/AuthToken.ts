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
    return new AuthToken(
      responseData.access_token,
      responseData.refresh_token,
      responseData.id_token,
      responseData.expires_in,
      responseData.token_type,
      responseData.scope
    );
  }

  static fromStorage(fields): AuthToken {
    return new AuthToken(
      fields._accessToken,
      fields._refreshToken,
      fields._idToken,
      fields._expiryDate,
      fields._tokenType,
      fields._scope
    );
  }

  public static computeTokenExpiryDate(dateNow: Date, expiresIn: number): Date {
    dateNow.setSeconds(dateNow.getSeconds() + (expiresIn - 20));
    return dateNow;
  }

  public isAccessTokenExpired() {
    if (this.expiryDate.getTime() <= new Date().getTime()) {
      return true;
    }
    return false;
  }

  public save() {
    try {
      return storage.save("auth_token", JSON.stringify(this));
    } catch (e) {
      throw Error("Error saving AuthToken: " + e);
    }
  }

  public static async load(): Promise<AuthToken> {
    try {
      const authToken = await storage.load("auth_token");
      return AuthToken.fromStorage(authToken);
    } catch (e) {
      throw Error("Error loading AuthToken: " + e);
    }
  }

  public static async loadAndRefreshAccessTokenIfExpired(): Promise<AuthToken> {
    try {
      const authToken: AuthToken = await AuthToken.load();


      if (!authToken.isAccessTokenExpired()) {
        return authToken;
      }

      const newAuthToken: AuthToken = await refreshExpiredAccessToken(
        authToken.refreshToken
      );

      //TODO remove in prod
      await newAuthToken.save();
      return newAuthToken;
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

    this.notNull(value);
    this._accessToken = value;
  }

  set refreshToken(value) {
    this.notNull(value);
    this._refreshToken = value;
  }

  set idToken(value) {
    this.notNull(value);
    this._idToken = value;
  }

  set expiryDate(value: number | Date) {
    this.notNull(value);
    if (value instanceof Date) {
      this._expiryDate = value;
    } else {
      this._expiryDate = AuthToken.computeTokenExpiryDate(new Date(), value);
    }
  }

  set tokenType(value) {
    this.notNull(value);
    this._tokenType = value;
  }

  set scope(value) {
    this.notNull(value);
    this._scope = value;
  }

  notNull(value: any) {
    //TODO change and test empty string etc..
    //TODO meaningful msg
    if (value == null) {
      throw Error("value must not be null");
    }
  }
}

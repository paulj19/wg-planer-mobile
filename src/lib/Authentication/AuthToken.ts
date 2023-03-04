export default class AuthToken {
  _accessToken: string;
  _refreshToken: string;
  _idToken: string;
  _expiryDate: Date;
  _tokenType: string;
  _scope: string;

  constructor(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    expiresIn: number | Date,
    tokenType: string,
    scope: string
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.idToken = idToken;
    this.expiryDate = expiresIn;
    this.tokenType = tokenType;
    this.scope = scope;
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

  get accessToken(): string {
    return this._refreshToken;
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
    this._expiryDate = AuthToken.computeTokenExpiryDate(new Date(), value);
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
    if (value == null) {
      throw Error("value must not be null");
    }
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

}


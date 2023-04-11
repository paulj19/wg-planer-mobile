class AuthToken_ {
  _accessToken: string | null;
  _refreshToken: string | null;
  _idToken: string | null;
  _expiryDate: Date | null;
  _tokenType: string | null;
  _scope: string | null;

  private constructor() {}

  private static INSTANCE: AuthToken_ = new AuthToken_();

  public static getInstance(): AuthToken_ {
    return AuthToken_.INSTANCE;
  }

  public fromApiResponse(responseData: any): void {
    AuthToken_.validateNotNull(responseData);
    this.accessToken = responseData.access_token;
    this.refreshToken = responseData.refresh_token;
    this.idToken = responseData.id_token;
    this.expiryDate = responseData.expires_in;
    this.tokenType = responseData.token_type;
    this.scope = responseData.scope;
  }

  public fromStorage(fields): void {
    AuthToken_.validateNotNull(fields);
    this.accessToken = fields._accessToken;
    this.refreshToken = fields._refreshToken;
    this.idToken = fields._idToken;
    this.expiryDate = new Date(fields._expiryDate);
    this.tokenType = fields._tokenType;
    this.scope = fields._scope;
  }

  public isPresent(): boolean {
    if (
      this.accessToken &&
      this.refreshToken &&
      this.idToken &&
      this.expiryDate &&
      this.tokenType &&
      this.scope
    ) {
      return true;
    }
    return false;
  }
  
  public isAccessTokenPresent(): boolean {
    return this.accessToken ? true : false;
  }

  public clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.idToken = null;
    this.expiryDate = null;
    this.tokenType = null;
    this.scope = null;
  }

  public static computeTokenExpiryDate(dateNow: Date, expiresIn: number): Date {
    dateNow.setSeconds(dateNow.getSeconds() + (expiresIn - 20));
    return dateNow;
  }

  get accessToken(): string | null {
    return this._accessToken;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  get idToken(): string | null {
    return this._idToken;
  }

  get expiryDate(): Date | null {
    return this._expiryDate;
  }

  get tokenType(): string | null {
    return this._tokenType;
  }

  get scope(): string | null {
    return this._scope;
  }

  set accessToken(value) {
    this._accessToken = value;
  }

  set refreshToken(value) {
    this._refreshToken = value;
  }

  set idToken(value) {
    this._idToken = value;
  }

  set expiryDate(value: number | Date | null) {
    if (value instanceof Date) {
      this._expiryDate = value;
    } else if (value) {
      this._expiryDate = AuthToken_.computeTokenExpiryDate(new Date(), value);
    } else {
      this._expiryDate = null;
    }
  }

  set tokenType(value) {
    this._tokenType = value;
  }

  set scope(value) {
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
const AuthToken: AuthToken_ = AuthToken_.getInstance();
export default AuthToken;

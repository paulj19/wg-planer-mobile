export interface TokenDto {
  accessToken: string,
  refreshToken: string, 
  idToken: string,
  expiresIn:Date,
  tokenType: string,
  scope?: string, 
}

export function tokenDto(fields: TokenDto): TokenDto {
  console.log("FFF" + JSON.stringify(fields));
  return {
    ...fields,
  };
}

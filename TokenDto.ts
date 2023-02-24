export default interface TokenDto {
  accessToken: string,
  refreshToken: string, 
  idToken: string,
  expiresIn: string,
  tokenType: string,
  scope?: string, 
}

export function tokenDto(fields: TokenDto): TokenDto {
  console.log("FFF" + JSON.stringify(fields));
  return {
    ...fields,
  };
}

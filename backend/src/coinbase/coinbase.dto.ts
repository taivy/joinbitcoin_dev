export class CoinbaseAccessDto {
  coinbaseId: string;
  accessToken: string;
  refreshToken: string;
}

export class CoinbaseToAuth0MappingDto {
  coinbaseId: string;
  auth0Id: string;
}
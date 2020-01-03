interface Presentation {
  metadatas: PresentationMetadata
  job?: string,
  experience?: string,
  devWebProfiles?: string,
  jsTime?: string,
  foundCommunity?: string,
  freeComment?: string
}

interface PresentationMetadata {
  readCodeOfConductSnowflake: string
}
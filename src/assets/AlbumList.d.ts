export type Root = Root2[]

export interface Root2 {
  albumTitle: AlbumTitle
  songs: Song[]
}

export interface AlbumTitle {
  ja: string
  en: string
}

export interface Song {
  title: Title
  videoId: string
}

export interface Title {
  ja: string
  en: string
}

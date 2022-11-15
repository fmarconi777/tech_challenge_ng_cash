export type HttpResponse = {
  status: number
  body: unknown
}

export type HttpRequest = {
  body?: any
  param?: any
  method?: any
  header?: any
}

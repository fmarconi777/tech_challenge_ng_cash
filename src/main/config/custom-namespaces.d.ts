type User = {
  id: string
  username: string
}

declare namespace Express {
  interface Request {
    user?: User
  }
}

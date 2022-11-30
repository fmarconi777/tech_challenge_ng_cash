import { SignUpController } from './singup'
import { Validator, AddUserAccount, UserData } from './singup-protocols'
import { MissingParamError, InvalidParamError, UsernameInUseError } from '@/presentation/errors'
import { badRequest, created, forbidden, methodNotAllowed, serverError } from '@/presentation/helpers/http-helper'

const makeUserValidatorStub = (): Validator => {
  class UserValidatorStub implements Validator {
    isValid (username: string): boolean {
      return true
    }
  }
  return new UserValidatorStub()
}

const makePasswordValidatorStub = (): Validator => {
  class PasswordValidatorStub implements Validator {
    isValid (param: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

const makeAddUserAccountStub = (): AddUserAccount => {
  class AddUserAccountStub implements AddUserAccount {
    async addUserAccount (userData: UserData): Promise<string | null> {
      return 'Account succesfully created'
    }
  }
  return new AddUserAccountStub()
}

type SubTypes = {
  sut: SignUpController
  userValidatorStub: Validator
  passwordValidatorStub: Validator
  addUserAccountStub: AddUserAccount
}

const makeSut = (): SubTypes => {
  const addUserAccountStub = makeAddUserAccountStub()
  const passwordValidatorStub = makePasswordValidatorStub()
  const userValidatorStub = makeUserValidatorStub()
  const sut = new SignUpController(userValidatorStub, passwordValidatorStub, addUserAccountStub)
  return {
    sut,
    userValidatorStub,
    passwordValidatorStub,
    addUserAccountStub
  }
}

describe('Singup Controller', () => {
  test('Should return 405 status if not allowed method is called', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: ''
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(methodNotAllowed())
  })

  test('Should return 400 status if username is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('username')))
  })

  test('Should return 400 status if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call UserValidator with correct param', async () => {
    const { sut, userValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(userValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_name')
  })

  test('Should return 500 status if UserValidator returns an error', async () => {
    const { sut, userValidatorStub } = makeSut()
    jest.spyOn(userValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 400 status if an invalid username is provided', async () => {
    const { sut, userValidatorStub } = makeSut()
    jest.spyOn(userValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'invalid_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('username')))
  })

  test('Should call PasswordValidator with correct param', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should return 500 status if PasswordValidator returns an error', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 400 status if an invalid password is provided', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'invalid_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })

  test('Should call AddUserAccount with correct values', async () => {
    const { sut, addUserAccountStub } = makeSut()
    const addSpy = jest.spyOn(addUserAccountStub, 'addUserAccount')
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 status if AddUserAccount returns an error', async () => {
    const { sut, addUserAccountStub } = makeSut()
    jest.spyOn(addUserAccountStub, 'addUserAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError())
  })

  test('Should return 403 status if AddUserAccount returns null', async () => {
    const { sut, addUserAccountStub } = makeSut()
    jest.spyOn(addUserAccountStub, 'addUserAccount').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new UsernameInUseError()))
  })

  test('Should return 201 status if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_name',
        password: 'any_password'
      },
      method: 'POST'
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created('Account succesfully created'))
  })
})

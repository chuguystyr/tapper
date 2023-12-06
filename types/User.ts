export type User = {
    _id?: string,
    login: string,
    firstName: string,
    lastName: string,
    age?: number,
    location?: string,
    password: string,
    confirmPassword?: string,
    avatar?: File | null | string,
    email?: string,
    facebook?: string,
    twitter?: string,
    instagram?: string,
    linkedIn?: string,
    skype?: string
}
import { hash, compare } from 'bcrypt';

export const encryptPassword = async (password: string) => {
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);
    return hashedPassword;
};

export const verifyPassword = async (
    password: string,
    hashedPassword: string
) => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
};


export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET as string;

const { NODE_ENV } = process.env;

interface IEnvironmentConfig {
  NODE_ENV: string | undefined;
    JWT_TOKEN_SECRET: string;
}

export const environmentConfig: IEnvironmentConfig = {
    NODE_ENV: NODE_ENV,
    JWT_TOKEN_SECRET:JWT_TOKEN_SECRET,
};

export interface IPasswordService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string | null): Promise<boolean>;
}

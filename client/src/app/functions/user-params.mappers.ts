import { IUserParams } from "../models/user-params.model";

export const mapToUserParams = (gender: string | undefined, minAge = 18, maxAge = 100, pageNumber = 1, pageSize = 5, orderBy = 'lastActive'): IUserParams => ({
  gender: gender === 'female' ? 'male' : 'female',
  minAge,
  maxAge,
  pageNumber,
  pageSize,
  orderBy,
});
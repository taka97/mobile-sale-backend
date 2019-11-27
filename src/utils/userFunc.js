/* eslint-disable import/prefer-default-export */
/**
 * Remove some field unused
 * @param {User} user user data
 */
export const simpleUser = (user) => ({
  ...user,
  password: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  isDeleted: undefined,
  __v: undefined,
});

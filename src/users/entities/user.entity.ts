export class User {
  id!: number;
  name!: string;
  email!: string;
  telephone!: string;
  password!: string;
  address!: string | null;
  verified!: boolean | null;
  registerAt!: Date;
  rolId!: number;
}

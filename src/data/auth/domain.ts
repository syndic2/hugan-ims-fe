interface AuthProps {
  username?: string;
  password?: string;
}

export const InitialAuth: AuthProps = {
  username: '',
  password: ''
};

export class Auth {
  public props: AuthProps;

  protected constructor(props: AuthProps) {
    this.props = props;
  }

  static create(props: AuthProps): Auth {
    return new Auth(props);
  }

  get username(): string | undefined {
    return this.props.username;
  }

  get password(): string | undefined {
    return this.props.password;
  }
}

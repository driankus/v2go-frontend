export class User {
  // Data model to store user info (a JSON-serialized string returned by API) in the UI
  constructor(
    public id: number,
    private _token: string,
    private _tokenExpirationDate: Date,
    public username?: string,
    public first_name?: string,
    public last_name?: string,
    public group?: string,
  ) { }

  // Get token if exists and not expired
  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
  // Handle the conversion from JSON to data object
  private create (data: any): User {
    return new User(
      data.id,
      data.username,
      data.first_name,
      data.last_name,
      data.group,
    );
  }

  // Check if user is logged in
  // private getUser(): User {
  //   const userData = localStorage.getItem('v2go.user');
  //   if (userData) {
  //     return User.create(JSON.parse(userData));
  //   }
  //   return null;
  // }

  // Determines whether the user belongs to the group (DRIVER)
  // isDriver(): boolean {
  //   const user = User.getUser();
  //   if (user === null) {
  //     return false;
  //   }
  //   return user.group === 'driver';
  // }
}

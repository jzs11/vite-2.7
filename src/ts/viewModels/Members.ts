type accessLevel = {
  name: string;
  value: number;
};

class Members {
  accessLevels: accessLevel[];

  constructor() {
    this.accessLevels = [
      {
        name: 'Admin',
        value: 0,
      },
      {
        name: 'Member',
        value: 1,
      },
      {
        name: 'External',
        value: 2,
      },
    ];
  }
}

export default Members;

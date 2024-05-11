export class order {
    constructor(
      public itemName: string = '',
      public unitPrice: number = 0,
      public units: number = 0,
      public unitTotalPrice: number = 0,
    ) {}
  }
  export class DataSource {
    constructor(
      public imagePath: string = '',
      public uname: string = '',
      public productName: string = '',
      public budget: number = 0,
    ) {}
  }
  
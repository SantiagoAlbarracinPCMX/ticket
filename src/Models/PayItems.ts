/* eslint-disable prettier/prettier */
export class PayItems {
    
  public description: string;
  public price: number;

  constructor(description: string, price: number) {
    this.description = description;
    this.price = price;
  }
}

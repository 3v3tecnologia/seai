export class DecimalFormatter {
  static truncate(value: number, decimal: number) {
    const num = value.toString(); //If it's not already a String
    const end = decimal + 1;
    return Number(num.slice(0, num.indexOf(".") + end)); //If you need it back as a Number
  }
}

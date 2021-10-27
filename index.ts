interface IEmployee {
  name: string;
  grossSalary: number;
  overTimeTotal: number;
  overTimeAmount: number;
  aliquotINSS: number;
  aliquotIRRF: number;
  contributionAmountINSS: number;
  discountAmountIRRF: number;
  netSalary: number;
}

class Employee {
  employee: IEmployee;

  constructor() {
    this.employee = {} as IEmployee;
  }
}

function numberToFix(number: number, fixed: number) {
  let regEx = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');

  return number.toString().match(regEx)[0];
}

function computeAmountOverTime(grossSalary: number, overTime: number) {
  let totalAmount = (((grossSalary / 200) * 1.5) * overTime);

  return parseFloat(numberToFix(totalAmount, 2));
}

function computeContributionINSS(grossSalary: number, amountOverTime: number) {
  let aliquotInss = 0,
    contributionAmountInss = 0,
    baseAmount = grossSalary + amountOverTime;
  const MAX_AMOUNT_INSS = 713.09;

  if (baseAmount <= 1100) {
    aliquotInss = 7.5;
  } else if (
    (baseAmount > 1100)
    && (baseAmount <= 2203.48)
  ) {
    aliquotInss = 9;
  } else if (
    (baseAmount > 2203.48)
    && (baseAmount <= 3305.22)
  ) {
    aliquotInss = 12;
  } else if (
    baseAmount > 3305.23
    && baseAmount <= 6433.57
  ) {
    aliquotInss = 14;
  }

  contributionAmountInss = baseAmount * (aliquotInss / 100);
  contributionAmountInss = contributionAmountInss <= MAX_AMOUNT_INSS ? contributionAmountInss : MAX_AMOUNT_INSS;
  contributionAmountInss = parseFloat(numberToFix(contributionAmountInss, 2));

  return {
    aliquot: aliquotInss,
    contributionAmount: contributionAmountInss
  };
}

function computeDiscountIRRF(grossSalary: number, contributionAmountInss: number, amountOverTime: number) {
  let aliquotIrrf = 0,
    amountDiscountIrrf = 0,
    baseAmount = grossSalary - contributionAmountInss + amountOverTime;

  if (
    (baseAmount > 1903.98)
    && (baseAmount <= 2826.65)
  ) {
    aliquotIrrf = 7.5;
  } else if (
    (baseAmount > 2826.65)
    && (baseAmount <= 3751.05)
  ) {
    aliquotIrrf = 15;
  
  } else if (
    (baseAmount > 3751.05)
    && (baseAmount <= 4664.68)
  ) {
    aliquotIrrf = 22.5;
  } else if (baseAmount > 4664.68) {
    aliquotIrrf = 27.5;
  }

  amountDiscountIrrf = (baseAmount * (aliquotIrrf / 100));
  amountDiscountIrrf = parseFloat(numberToFix(amountDiscountIrrf, 2));

  return {
    aliquot: aliquotIrrf,
    discountAmount: amountDiscountIrrf
  }  
}

function computeEmployeeTotalAmount(name: string, grossSalary: string, overTime: string) {
  let person = new Employee();

  person.employee.name = name;
  person.employee.grossSalary = parseFloat(grossSalary);
  person.employee.overTimeTotal = parseFloat(overTime);

  if (!(person.employee.grossSalary)) {
    console.log('O salário enviado não é válido!')
    return;
  }

  if (!(person.employee.overTimeTotal)) {
    console.log('Total de horas extra não é válido!')
    return;
  }

  person.employee.overTimeAmount = computeAmountOverTime(person.employee.grossSalary, person.employee.overTimeTotal);

  let computedINSS = computeContributionINSS(person.employee.grossSalary, person.employee.overTimeTotal);
  person.employee.aliquotINSS = computedINSS.aliquot;
  person.employee.contributionAmountINSS = computedINSS.contributionAmount;

  let computedIRRF = computeDiscountIRRF(person.employee.grossSalary, person.employee.contributionAmountINSS, person.employee.overTimeAmount);
  person.employee.aliquotIRRF = computedIRRF.aliquot;
  person.employee.discountAmountIRRF = computedIRRF.discountAmount;

  person.employee.netSalary = person.employee.grossSalary + person.employee.overTimeAmount - person.employee.contributionAmountINSS - person.employee.discountAmountIRRF;
  person.employee.netSalary = parseFloat(numberToFix(person.employee.netSalary, 2));

  console.log(JSON.stringify(person, null, 2));
}

computeEmployeeTotalAmount(process.argv[2], process.argv[3], process.argv[4]);

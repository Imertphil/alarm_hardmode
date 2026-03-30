export type MathProblem = {
  expression: string;
  answer: number;
};

export const generateMathProblem = (): MathProblem => {
  const operators = ["+", "-", "*"];

  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  const d = Math.floor(Math.random() * 9) + 1;

  const op1 = operators[Math.floor(Math.random() * operators.length)];
  const op2 = operators[Math.floor(Math.random() * operators.length)];
  const op3 = operators[Math.floor(Math.random() * operators.length)];

  const expression = `${a} ${op1} ${b} ${op2} ${c} ${op3} ${d}`;

  const answer = new Function(`return ${expression}`)();

  return { expression, answer };
};

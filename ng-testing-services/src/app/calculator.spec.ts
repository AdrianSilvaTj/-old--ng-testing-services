import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  describe('Test for multiply', () => {
    it('should return a nine', () => {
      // Arrange: Preparar las herremientas a emplear
      const calculator = new Calculator();
      //Act : Ejecutar
      const rta = calculator.multiply(3, 3);
      //Assert: Probar, resolver la hipotesis
      expect(rta).toEqual(9);
    });

    it('should return a four', () => {
      // Arrange: Preparar las herremientas a emplear
      const calculator = new Calculator();
      //Act : Ejecutar
      const rta = calculator.multiply(1, 4);
      //Assert: Probar, resolver la hipotesis
      expect(rta).toEqual(4);
    });
  });

  describe('Test for divide', () => {
    it('should return some number', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });

    it('should return some number', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 0)).toBeNull();
      expect(calculator.divide(10000, 0)).toBeNull();
    });
  });

  describe('Test for matchers', () => {
    it('test matchers', () => {
      let name = 'adrian';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1+3 ===4).toBeTruthy(); //false
      expect(1+3 ===6).toBeFalsy();

      expect(5).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('123456').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });
  });
});

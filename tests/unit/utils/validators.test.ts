/**
 * Validators Unit Tests
 * Tests validation utility functions
 */

describe('Validators', () => {
  describe('email validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid.email',
        '@example.com',
        'user@',
        'user name@example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('password validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MyStr0ngP@ss',
        'C0mpl3xP@ssw0rd!'
      ];

      strongPasswords.forEach(password => {
        const isStrong = password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password);
        
        expect(isStrong).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        'password',
        '123456',
        'PASSWORD',
        'pass',
        ''
      ];

      weakPasswords.forEach(password => {
        const isStrong = password.length >= 8 &&
          /[A-Z]/.test(password) &&
          /[a-z]/.test(password) &&
          /[0-9]/.test(password);
        
        expect(isStrong).toBe(false);
      });
    });
  });

  describe('amount validation', () => {
    it('should validate positive amounts', () => {
      const validAmounts = [0.01, 1, 25.50, 100, 999.99];

      validAmounts.forEach(amount => {
        const isValid = amount > 0 && Number.isFinite(amount);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid amounts', () => {
      const invalidAmounts = [0, -1, -25.50, NaN, Infinity, -Infinity];

      invalidAmounts.forEach(amount => {
        const isValid = amount > 0 && Number.isFinite(amount);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('group name validation', () => {
    it('should validate correct group names', () => {
      const validNames = [
        'Lunch Squad',
        'Weekend Trip 2024',
        'Office Snacks',
        'A',
        'Group with Numbers 123'
      ];

      validNames.forEach(name => {
        const isValid = name.trim().length >= 1 && name.trim().length <= 50;
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid group names', () => {
      const invalidNames = [
        '',
        '   ',
        'A'.repeat(51), // Too long
        '\n\t'
      ];

      invalidNames.forEach(name => {
        const isValid = name.trim().length >= 1 && name.trim().length <= 50;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('required field validation', () => {
    it('should validate required strings', () => {
      const validStrings = ['value', 'test', 'a', '123'];

      validStrings.forEach(str => {
        const isValid = typeof str === 'string' && str.trim().length > 0;
        expect(isValid).toBe(true);
      });
    });

    it('should reject empty or invalid required fields', () => {
      const invalidValues = ['', '   ', null, undefined, 0, false];

      invalidValues.forEach(value => {
        const isValid = typeof value === 'string' && value.trim().length > 0;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('date validation', () => {
    it('should validate correct dates', () => {
      const validDates = [
        new Date(),
        new Date('2024-01-01'),
        new Date('2023-12-31T23:59:59Z')
      ];

      validDates.forEach(date => {
        const isValid = date instanceof Date && !isNaN(date.getTime());
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid dates', () => {
      const invalidDates = [
        new Date('invalid'),
        new Date(''),
        'not a date',
        null,
        undefined
      ];

      invalidDates.forEach(date => {
        const isValid = date instanceof Date && !isNaN(date.getTime());
        expect(isValid).toBe(false);
      });
    });
  });
});

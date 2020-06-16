const lib = require('../lib');

test('example', () => {

    expect(() => {
        lib.example(undefined);
    }).toThrow('Input should be a number');

    const result1 = lib.example(15)
    expect(result1).toBe('FizzBuzz')

    const result2 = lib.example(5)
    expect(result2).toBe('Buzz')

    const result3 = lib.example(33)
    expect(result3).toBe('Fizz')


})
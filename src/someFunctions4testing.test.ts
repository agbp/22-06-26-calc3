import { validateTestValue } from './someFunctions4testing';

test('some testing test', () => {
	expect(validateTestValue(50)).toBe(true);
});

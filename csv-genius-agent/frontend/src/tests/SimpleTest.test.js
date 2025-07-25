// Prueba simple para verificar que Jest funciona
describe('Sistema de Testing', () => {
  test('suma dos números correctamente', () => {
    expect(2 + 2).toBe(4);
  });

  test('verifica que un string contiene texto', () => {
    const texto = 'CSV Genius Agent';
    expect(texto).toContain('CSV');
    expect(texto).toContain('Genius');
  });

  test('verifica que un array tiene elementos', () => {
    const array = ['a', 'b', 'c'];
    expect(array).toHaveLength(3);
    expect(array).toContain('b');
  });
}); 
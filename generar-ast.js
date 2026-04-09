import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

const vistas = [
  './src/app.jsx',
  './src/pages/Home/ViewHome.jsx',
  './src/pages/Gender/ViewGender.jsx',
  './src/pages/FlowAdults/ViewLookAnalysis.jsx',
  './src/pages/FlowAdults/ViewAttitude.jsx',
  './src/pages/FlowAdults/ViewPlan.jsx',
  './src/pages/Result/ViewResult.jsx',
  './src/pages/FlowKids/ViewKidsAnimal.jsx',
  './src/pages/FlowKids/ViewKidsColor.jsx',
  './src/pages/FlowKids/ViewKidsHero.jsx',
];

vistas.forEach((ruta) => {
  const nombre = path.basename(ruta, '.jsx');
  const codigo = fs.readFileSync(ruta, 'utf-8');

  const ast = parse(codigo, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const salida = `ast-de-${nombre}.json`;
  fs.writeFileSync(salida, JSON.stringify(ast, null, 2));
  console.log(`✓ Generado: ${salida}`);
});

console.log('\n¡Todos los AST generados!');

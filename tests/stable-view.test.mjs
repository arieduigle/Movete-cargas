import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=fs.readFileSync('stable-view.js','utf8');
const fixture=[
 {student_name:'Sofía Delgado',exercise:'Sentadilla',date:'2026-11-21T10:00',weight_kg:60,reps:5,sets:5,notes:''},
 {student_name:'Sofia Delgado',exercise:'Sentadilla',date:'2026-11-21T11:00',weight_kg:60,reps:5,sets:5,notes:''},
 {student_name:'Sofía Delgado',exercise:'Sentadilla',date:'2026-11-22T10:00',weight_kg:62,reps:5,sets:5,notes:''}
];
function boot(storage){
 const context={seed:[fixture[0]],extra:JSON.parse(storage),records:[],manualStudents:['Sofia Delgado'],renderHome(){this.rendered=true},window:{},Set,Map,JSON,Number,String,Object,Array};
 vm.createContext(context);
 vm.runInContext(code,context);
 return {visible:context.records.length,students:context.manualStudents.length+new Set(context.records.map(x=>x.student_name)).size,diagnostic:context.window.MOVETE_DIAGNOSTICO(),storage:JSON.stringify(context.extra)};
}
const storage=JSON.stringify([fixture[1],fixture[2]]);
const a=boot(storage),b=boot(storage);
assert.equal(a.visible,2,'Debe ocultar registros repetidos');
assert.equal(a.visible,b.visible,'Dos aperturas deben mostrar igual cantidad');
assert.equal(a.students,b.students,'Dos aperturas deben mostrar igual cantidad de alumnos');
assert.equal(a.storage,storage,'La apertura no debe cambiar registros guardados');
assert.equal(b.storage,storage,'La reapertura no debe cambiar registros guardados');
console.log('Prueba de reapertura y duplicados OK');

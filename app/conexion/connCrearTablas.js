require('dotenv').config();

sqlUsuarios = "CREATE TABLE IF NOT EXISTS usuarios (id integer," +
                "nombres varchar(100)  NOT NULL collate nocase," +
                "apellidos varchar(100)  DEFAULT NULL collate nocase," +
                "sexo varchar(100)  NOT NULL," +
                "username varchar(100)  NOT NULL collate nocase," +
                "password varchar(100)  NOT NULL collate nocase," +
                "prueba_id integer(100)  NOT NULL," +
                "tipo integer DEFAULT '0')";

sqlPreguntas = "CREATE TABLE IF NOT EXISTS preguntas (id integer," +
                "definicion varchar(300)  NOT NULL collate nocase," +
                "tipo varchar(100)  NOT NULL collate nocase," +
                "prueba_id integer(100)  DEFAULT NULL," +
                "opc_a varchar(100)  DEFAULT NULL collate nocase," +
                "opc_b varchar(100)  DEFAULT NULL collate nocase," +
                "opc_c varchar(100)  DEFAULT NULL collate nocase," +
                "opc_d varchar(100)  DEFAULT NULL collate nocase," +
                "correcta varchar(100)  NOT NULL collate nocase," +
                "defini_img varchar(100)  DEFAULT NULL collate nocase," +
                "opc_a_img varchar(100)  DEFAULT NULL collate nocase," +
                "opc_b_img varchar(100)  DEFAULT NULL collate nocase," +
                "opc_c_img varchar(100)  DEFAULT NULL collate nocase," +
                "opc_d_img varchar(100)  DEFAULT NULL collate nocase," +
                "puntos varchar(100)  DEFAULT NULL collate nocase)";

sqlRespuestas = "CREATE TABLE IF NOT EXISTS respuestas (id integer," +
                "preg_id integer(100)  NOT NULL," +
                "usuario_id integer(100)  DEFAULT NULL," +
                "opcion_elegida varchar(100)  NOT NULL," +
                "correcta varchar(100)  NOT NULL collate nocase," +
                "duracion integer(3)  NOT NULL)";       
  
  sqlPruebas = "CREATE TABLE IF NOT EXISTS pruebas (id integer," +
                "nombre varchar(100)  NOT NULL collate nocase," +
                "alias varchar(100)  DEFAULT NULL collate nocase," +
                "dirigido varchar(100)  NOT NULL," +
                "mostrar_respuesta varchar(100)  NOT NULL collate nocase," +
                "puntos_promedio varchar(100)  NOT NULL collate nocase," +
                "tiempo_preg integer(3)  NOT NULL," +
                "actual integer(1)  DEFAULT NULL," +
                "tiempo_exam integer(3)  NOT NULL)";  
           





            

function createTable() {
    
    return new Promise(function(resolve, reject) {
    
        db = require('../conexion/connWeb');
        //db = new db();
        db.query(sqlUsuarios).then(function(res){
            console.log('tabla Usuarios creada');
            return db.query(sqlPreguntas);
        }).then(function(res){
            console.log('tabla Preguntas creada');
            return db.query(sqlRespuestas);
        }).then(function(res){
            console.log('tabla Respuestas creada');
            return db.query(sqlPruebas);
        }).then(function(res){
            console.log('tabla Pruebas creada');
            console.log('TODAS LAS TABLAS CREADAS');
        }).then(function(res){
            return new Promise(function(resolve, reject) {
        
            db = require('../conexion/connWeb');
            
            db.query('SELECT * FROM usuarios').then(function(result){
                return new Promise(function(resolve2, reject2) {
                    if (result.length > 0) {
                        resolve2('Usuarios ya estaban Insertados');
                    }else{
                        
                        hash_password   = '123';
                        consulta = "INSERT INTO `usuarios` VALUES (1,'ADMIN', '', 'M', 'ADMIN', '" + hash_password + "', '', 'Admin')," +
                                                                 "(2,'Espectador', 'Espectador', 'M', 'screen','" + hash_password + "',  '', 'Espectador')," +
                                                                 "(3,'EDILSON', 'MARQUEZ', 'M', 'edilson', '" + hash_password + "', 1, 'Usuario')," +
                                                                 "(4,'FELIX', 'DÍAZ', 'M', 'felix', '" + hash_password + "', 1, 'Usuario')," +
                                                                 "(5,'ERIK', 'ESLAVA', 'M', 'erik', '" + hash_password + "',  1, 'Usuario')," +
                                                                 "(6,'MEMO', 'SILVA', 'M', 'memo','" + hash_password + "',  1, 'Usuario')," +
                                                                 "(7,'JOSETH', 'GUERRERO', 'M', 'joseth', '" + hash_password + "',  1, 'Usuario')," +
                                                                 "(8,'DANIEL', 'GRANDAS', 'M', 'daniel',  '" + hash_password + "', 1, 'Usuario')" ; 
                                                                 
                        db.query(consulta).then(function(res){
                            resolve2('Usuarios Insertados');
                        })
                        
                    }
                })
            })
            .then(function(data){
                return new Promise(function(resolve2, reject2) {
                    db.query('SELECT * FROM preguntas').then(function(result){
                    
                        if (result.length > 0) {
                            resolve2('Preguntas ya estaban Insertados');
                        }else{
                            
                           
                            consulta        = "INSERT INTO `preguntas`(id, definicion, tipo, prueba_id, opc_a, opc_b, opc_c, opc_d, correcta) VALUES(1,'¿De donde era Simon Bolivar?', 'Múltiple', 1,  'Colombia', 'Venezuela', 'Francia', 'España', 'B'), " +
                                                                      "(2,'Cuánto es 51 + 14?', 'Múltiple', 1,  '66', '65', '64', '53', 'B'), " +
                                                                      "(3,'Cuál día es el de descanso?', 'Múltiple', 1,  'Quinto', 'Septimo', 'Sexto', 'Octavo', 'B'), " +
                                                                      "(4,'Cual es el libro mas corto de la biblia?', 'Múltiple', 1,  '2° Juan', '1° Juan', 'Salmos', 'Genesis', 'A'), " +
                                                                      "(5,'quien fue Albert Einstein?', 'Múltiple', 1,  'físico estadounidense', 'Escritor ruso', 'físico alemán', 'Escritor aleman', 'C'), " +
                                                                      "(6,'Cuanto es √3?', 'Múltiple', 1,  '1,732', '0,435', '29.19', '1,23', 'A'), " +
                                                                      "(7,'que discipulo traiciono a Jesus?', 'Múltiple', 1,  'Juan', 'Eliceo', 'Choncas', 'Judas Iscariote', 'D'), " +
                                                                      "(8,'quien es Dios ?', 'Múltiple', 1,  'pues Dios', 'lo ve todo', 'lo es todo', 'Un ente todo poderoso', 'D')" ;
                                                                      
                            db.query(consulta).then(function(res){
                                resolve2('Preguntas Insertadas');
                            })
                            
                        }
                    })
                })
            })
            .then(function(data){
                return new Promise(function(resolve2, reject2) {
                    db.query('SELECT * FROM pruebas').then(function(result){
                    
                        if (result.length > 0) {
                            resolve2('Pruebas ya estaban Insertadas');
                        }else{
                            
                            consulta = "INSERT INTO `pruebas` VALUES (1, 'Matarratas', 'mrratas', 'Dirigido',  'Si', 'Puntos', 30, 1, 20)";
                            db.query(consulta).then(function(res){
                                resolve2('Pruebas Insertadas');
                            })
                            
                        }
                    })
                })
            })
            
            .then(function(data){
                resolve('Agregados');
            })
            
            
        });
      });  
    });
    

        
}


module.exports = createTable;


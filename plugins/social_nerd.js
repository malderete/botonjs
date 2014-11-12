/*jslint node: true nomen: true stupid: true */

'use strict';
var _ = require('underscore');


var TALKED_TO_ME_SENTENCES = [
    '¿Quién es el General Failure y por qué está leyendo mi disco duro? ',
    'Hardware es aquello a lo que puedes dar patadas. Software es aquello a lo que sólo puedes insultar. ',
    'El cielo sobre el puerto tenía el color de una pantalla de televisor, sintonizado en un canal muerto. ',
    'La optimización prematura es la madre de todos los males. ',
    'IA es como un orgasmo: es mucho mejor cuando no tienes que simularla. ',
    'An oido hablar de lo que se llama la Web... ahora hasta mi gato tiene su propia página. ',
    'Sé conservador en lo que haces, sé liberal en lo que aceptas de otros. ',
    'No le atribuyas cualidades humanas a los ordenadores. No les gusta. ',
    'Cualquier tecnología lo suficientemente avanzada es indistingible de la magia. ',
    '640 Kb deberían ser suficientes para cualquiera. ',
    'Leer manuales de ordenador sin el hardware es tan frustrante como leer manuales de sexo sin el software. ',
    'Hay dos productos importantes que han salido de Berkeley: el LSD y el UNIX. No creemos que sea una coincidencia. ',
    'Los programadores de verdad no documentan. Si fué difícil de escribir, debe ser difícil de entender. ',
    'La inteligencia consiste no solo en el conocimiento, sino también en la destreza de aplicar los conocimientos en la práctica. ',
    'Cannot find REALITY.SYS. Universe halted. ',
    'Creo que hay mercado para unos cinco ordenadores en el mundo. ',
    'No hay ninguna razón para que alguien quiera un ordenador en su casa. ',
    'Los ordenadores son inútiles. Sólo pueden darte respuestas. ',
    'Si no fuera por el C, estaríamos escribiendo programas en BASI, PASAL, o OBOL. ',
    'Errar es humano, pero para j**** las cosas de verdad, necesitas un ordenador. ',
    'Cuídate de los programadores que llevan destornilladores. ',
    'Se ha creado el ordenador perfecto. Metes todos tus problemas y ya no vuelven a salir. ',
    'La razon por la que Dios pudo crear el universo en seis días es que no tuvo que preocuparse de hacerlo compatible con la versión anterior. ',
    'Lo siento, Dave. No puedo hacer eso. ',
    'Ordenador: dispositivo diseñado para automatizar errores y realizarlos más rápidamente. ',
    'Un ordenador es como el Dios del Antiguo Testamento, con un montón de reglas, y sin piedad. ',
    'Los hombres de verdad no hacen copias de seguridad. Publican sus cosas en servidores FTP públicos, y dejan que el resto del mundo las copie. ',
    'Los ordenadores son increíblemente rápidos, precisos, y estúpidos; los humanos son increíblemente lentos, imprecisos, y brillantes. Juntos, su potencia está más allá de lo imaginable. ',
    'Para definir la recursividad, primero debemos definir la recursividad. ',
    'Una de las principales causas de la caida del Imperio Romano fue que, al carecer del cero, no podían indicar que sus programas en C habían acabado correctamente. ',
    'En Internet, nadie sabe que eres un perro. ',
    'Dios es real, a menos que sea declarado entero. ',
    'El hardware es aquello a lo que puedes dar patadas. Software es aquello a lo que sólo puedes insultar. ',
    'El cielo sobre el puerto tenía el color de una pantalla de televisor, sintonizado en un canal muerto. ',
    'La optimización prematura es la madre de todos los males. ',
    'Todos hemos oido que un millón de monos escribiendo en un millón de máquinas de escribir podrían reproducir las obras completas de Shakespeare. Ahora, gracias a Internet, sabemos que eso no es cierto. ',
    'Cuando llegué a mi cargo, sólo los físicos de altas energías habían oido hablar de lo que se llama la Web... ahora hasta mi gato tiene su propia página. '
];

function socialNerd(nick, channel, text, message) {
    var bot = this,
        sentence = _.sample(TALKED_TO_ME_SENTENCES);

    bot.say(channel, nick + ', ' + sentence);
}

function setupPlugin(bot) {
    bot.on(bot.events.TALKED_TO_ME, socialNerd);
}


/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;

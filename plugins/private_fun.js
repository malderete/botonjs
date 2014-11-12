/*jslint node: true nomen: true stupid: true */

'use strict';
var _ = require('underscore');

var PRIVATE_MESSAGE_SENTENCES = [
    'Todo tiempo pasado, fue anterior.',
    'El que nace pobre y feo, tiene grandes posibilidades de que al crecer, se le desarrollen ambas condiciones.',
    'Los honestos son inadaptados sociales.',
    'Pez que lucha contra la corriente, muere electrocutado.',
    'Huye de las tentaciones, despacio, para que puedan alcanzarte.',
    'De cada diez personas que miran television, cinco son la mitad',
    'Recuerda siempre que eres único... Exactamente igual que todos los demás.',
    'El problema de los imparciales es que están sobornados por las dos partes.',
    '¿Y por qué no ejecutan a los malos compositores?',
    'Para un erudito debe ser terrible perder el conocimiento.',
    'Sé bueno con tus hijos. Ellos elegirán tu residencia.',
    'Hay tres tipos de personas: los que saben contar y los que no.',
    'Diplomacia es el arte de decir "bonito perrito"... hasta que puedas encontrar una piedra.',
    'Un día sin sol es como, ya sabes, noche.',
    'La marihuana causa amnesia y... otras cosas que no recuerdo.',
    'Persona muy ocupada busca relación seria para el 13 de Mayo de 2002, a las 22:30 horas.',
    'Ejecutivo agresivo busca monedas antiguas para partirles la cara.',
    'En estos tiempos se necesita mucho ingenio para cometer un pecado original.',
    'Solo quien ha comido ajo puede darnos una palabra de aliento.',
    'Mi mujer tiene un físico bárbaro. (Einstein)',
    'Morir es como dormir, pero sin levantarse a hacer pis.',
    'Voy a escribir algo profundo... Subsuelo.',
    'El dermatólogo es el único médico que puede dar diagnósticos superficiales.',
    'Aclamar es aplaudir con la garganta.',
    'La advertencia consiste en amenazar por las buenas.',
    'En Sodoma y Gomorra inventaron las relaciones públicas.',
    'Me pregunto: ¿Qué haría yo sin mí?',
    'Los mocos son la plastilina de los pobres.',
    'A Gardel le gustaban los tangos. A mi, los tangas.',
    'A una mujer famosa hay que levantarle un busto.',
    'Los escultores siguen viviendo en la Edad de Piedra.',
    'Me gustan los reincidentes porque no cambian de idea.',
    'Los notarios no creen en las sagradas escrituras.',
    'Hoy en día la fidelidad sólo se ve en los equipos de sonido.',
    'La esclavitud no ha sido abolida, solo se puso en nómina.',
    'Hay estudiantes a los que les apena ir al hipódromo y ver que hasta los caballos logran terminar su carrera.',
    'Estoy en una situación tan delicada que si mi mujer se va con otro, yo me voy con ellos.',
    'La calvicie puede que sea símbolo de virilidad, pero nos reduce la oportunidad de comprobarlo.',
    'Ahorro debería escribirse sin h, para economizar una letra.',
    'Si el mundo es un pañuelo, nosotros ¿qué seremos?',
    'El negocio mas expuesto a la quiebra es el de la cristalería.',
    'No soy un pijo, o sea, lo juro por mis Reebok, ok?',
    'Dicen que cuando Piscis y Acuario se casan, el matrimonio naufraga.',
    'Algunos matrimonios acaban bien, otros duran toda la vida.',
    'Se separaron por incompatibilidad de ronquidos.',
    'Antes sufría de amnesia, ahora no me acuerdo.',
    'El fabricante de ventiladores vive del aire.',
    'El diabético no puede ir de luna de miel.',
    '¿Por qué temblara la gelatina? ¿Será  que sabe lo que le espera?',
    'Después de los 60, todos pertenecen al sexo débil.',
    'Matusalén murió por la ley de la grave-edad.',
    'Nunca hay que pegarle a un hombre caído, puede levantarse.',
    'La locura es hereditaria; se hereda de los hijos.',
    'No existen frases de seis palabras.',
    'He oído hablar tan bien de ti, que creía que estabas muerto.',
    '¿Eres feliz o casado?'
];


function privateJoke(nick, text, message) {
    var bot = this,
        reply = _.sample(PRIVATE_MESSAGE_SENTENCES);

    bot.say(nick, reply);
}

function setupPlugin(bot) {
    bot.on(bot.events.PRIVATE_MESSAGE, privateJoke);
}

/**
 * Expose `setupPlugin(bot)`.
 */
module.exports = setupPlugin;

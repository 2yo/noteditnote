'use strict';

$(document).ready(function(){

var body = $('#wrapper')
// мой любимый браузер, но реально не знаю как по другому сделать, странный однопиксельный отступ для текста у input
if (navigator.userAgent.search(/Firefox/) > -1) body.addClass('moz')


var socket = io.connect();


// обрабатываем подписку
var subscribe = $('#subscribe')
var mail = $('#mail')
var regexp = /([\w\-]+\@[\w\-]+\.[\w\-]+)/

subscribe.on('click', function(){mail.focus(); return false}); // так на на body у нас висит click 
mail.on('focus', function(){body.addClass('s'); return false}); // добавляем красоту

// постоянно проверяем значение. Ну а как еще?
function testmail(){
    if(regexp.test(mail.val())){
        subscribe.addClass('ready')
    } else (
        subscribe.removeClass('ready')
    )
}
setInterval(testmail, 200) 

// отправляем мыло
subscribe.on('submit', function(){
    if(regexp.test(mail.val())){
        socket.emit('mail', mail.val());
    } else {
        alert('this is no')
    }
    return false
});

// успешно
socket.on('mail_save', function () {
    body.removeClass('s')
    subscribe.addClass('hide')
});

// fail
socket.on('bum2', function () {
    alert('Already have such')
});




// делаем notedit форму      
var input = $('#input') // инпут
var text = $('#text') // введенный текст
var send = '' // временная переменная, раз в секунду отсылаем и очищаем
var flag = 0 // защита от автоповтора


input.focus().on('keydown', function(e){
    if(flag < 2) {
        var val = input.val()
        $('#new').addClass('online').children('.time').text(new Date().getTime())
        if(val.length < 2){
            text.html(text.html()+val)
            send = send + val
        }
        if(e.keyCode==13){
            text.html(text.html()+'<br>')
            send = send + '¶'
        }
        input.val('')
    } else{return false} flag++
}).on('keyup', function(){flag = 0});

body.on('click', function(){
    input.focus()
    body.removeClass('s')
});

function sendtext(){
    var val = input.val()
    if(val.length == 1) {
        text.html(text.html()+val)
        send = send + val
        input.val('')
    }
    if(send !== ''){
        socket.emit('contine', send);
        console.log(send)
        send = ''
    }
}
setInterval(sendtext, 1000)


socket.on('contine', function (data) {
    var id = data.id
    var text = data.text.length;
    var i = text
    if(!document.getElementById(id)) {
        $("<div></div>").addClass('post online').attr('id', id)
        .html('<div class="time">'+data.time+'</div><span class="text"></span><span class="author">anonim</span>')
        .insertAfter("#new")
    }

    var post = $('#'+id); post.addClass('online')
    var r = post.children('.text') 
    post.children('.time').html(data.time)
    var timer = setInterval(function() {
        var sign = data.text.charAt(text-i)
        if (sign == '¶') {sign = '<br>'} 
        r.html(r.html()+sign)
        i--;
        if (i == -1) clearInterval(timer);
    },  1000 / i);
    // вот еще заметил эта штука глючит, наверно в неактивном акне 
    // интервалы накапливаются, нужно переписать, с просони посмотрю,
    // не обращай внимания
});


// кто то пишет явную хуйню
socket.on('bum', function () {
    alert('Do not break, I did it all night')
    $('#new').remove()
});

// кто то подключился
socket.on('online', function (online) {
    $('#online').html('<h2>online</h2><span>'+online+'</span>')
});

// кто то отключился
socket.on('done', function (id) {
    $('#'+id).removeClass('online')
});


});


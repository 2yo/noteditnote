'use strict';

$(document).ready(function(){

var body = $('#wrapper')
// странный однопиксельный отступ для текста у input
if (navigator.userAgent.search(/Firefox/) > -1) body.addClass('moz')


var socket = io.connect();


// обрабатываем подписку
var subscribe = $('#subscribe')
var mail = $('#mail')
var regexp = /([\w\-]+\@[\w\-]+\.[\w\-]+)/

subscribe.on('click', function(){mail.focus(); return false}); // так на на body у нас висит click 
mail.on('focus', function(){body.addClass('mailived'); return false}); // добавляем красоту

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
    body.removeClass('mailived')
    subscribe.addClass('hide')
});

// fail
socket.on('bum2', function () {
    alert('Already have such')
});




// делаем notedit форму      
var input = $('#input') // инпут
var text = $('#text') // введенный текст
var edit = $('#edit') // текст открытый для редактирования

var send = '' // временная переменная, раз в секунду отсылаем и очищаем
var oldval = ''

input.val('').focus().on('keydown', function(e){
    if(e.keyCode==13){
        text.html(text.html()+edit.text()+'<br>');
        edit.text('')
        send = send + '¶'
        input.val('')
    }
    if(e.keyCode==8){
        if (edit.text().length != 0) {
            edit.text(edit.text().substring(0, edit.text().length-1)) 
            if(send != '' && send != '·' && send != '··' && send != '···' && send != '····') {
                send = send.substring(0, send.length-1) 
            } else {send = send + '·'}
        }
    }
    endAndStartTimer()
});


var z = document.getElementById('input')

z.addEventListener('input', function(){
    var val = z.value
    $('#new').addClass('online').children('.time').text(new Date().getTime())
        
    if(val.length < 2) {
        edit.text(edit.text()+val)
        if(edit.text().length > 3)
        {
            text.html(text.html()+edit.text().charAt(0))
            edit.text(edit.text().substr(1))
        }
        send = send + z.value
        z.value = ''

        endAndStartTimer()

    } else {alert("Вы получили ачивку: Самый умный");  z.value = ''}
}, false);


var endAndStartTimer = (function () {
  var timer; 
  return function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(function(){
        text.html(text.html()+edit.text());
        edit.text('')
    },1000); 
  };
})();


// делам клик на боди
body.on('click', function(){
    body.removeClass('mailived')
    input.focus()
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

// получаем текст
socket.on('contine', function (data) {
    var id = data.id // дата поста
    var deltext = data.text.lastIndexOf('·') // сколько символов удаляем
    if(deltext != -1) {
        var text = data.text.slice(0,-deltext-1)
    } else {
        var text = data.text
    }
    
    

    // если сообщения новое - создаем блок
    if(!document.getElementById(id)) {
        $("<div></div>").addClass('post online').attr('id', id)
        .html('<div class="time">'+data.time+'</div><span class="text"></span><span class="author">anonim</span>')
        .insertAfter("#new")
    }

    var post = $('#'+id); 
    post.addClass('online'); // ставим класс online
    post.children('.time').html(data.time) // обновляем дату
    var r = post.children('.text') 
    var oldtext = r.html().replace(/(<span[^>]*>)(.*?)(<\/span>)/ig, "$2")
    var length = text.length;
    var yo = ''
    for (var i = length; i > 0; i--) {
       var sign = text.charAt(length-i)
        if (sign == '¶') {sign = '<br>'} 
        yo = yo.concat('<span class="s'+Math.floor(20/(length+1)*(i))+' s">'+sign+'</span>')
    }
    if(deltext != -1) {
        r.removeClass('wrap_s').html(oldtext.slice(0,-deltext-1)+yo)
    } else {
        r.removeClass('wrap_s').html(oldtext+yo)
    }
    console.log(deltext)
    setTimeout(function(){r.addClass('wrap_s')},10)
    // обязательно переписать
});


// кто то слишком быстро пишет
socket.on('bum', function () {
    alert('Do not break, I did it all night')
    $('#new').remove()
});

socket.on('delite', function (del) {
    $('#'+del.id).remove()
});
// кто то подключился
socket.on('online', function (online) {
    $('#online').html('<h2>online</h2><span>'+online+'</span>')
});

// кто то отключился
socket.on('done', function (id) {
    $('#'+id).removeClass('online')
});

// удлаяем пост
$('.del').on('click', function(){
    socket.emit('delite');
    $('#new').remove()
});


});


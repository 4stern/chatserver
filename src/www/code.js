$(function() {
    var nickname = null,
        dLoginName = document.getElementById('login_username'),
        
        wrapperLogin = document.getElementById('page_login'),
        wrapperHome = document.getElementById('page_home'),
        wrapperConnecting = document.getElementById('page_connection'),
        
        socket = io.connect('http://localhost');
    
    if(!nickname){
        dLoginName.value = 'Guest'+ ~~( (Math.random() * (100000 - 100)) + 100 );
    } else {
        dLoginName.value = nickname;
    }
    
    $('#login').click(function(){
        if(dLoginName.value!==''){
            nickname = dLoginName.value;
            socket.emit('setNickname',nickname);
        }
    });
    
    socket.on('connect', function (data) {
        wrapperConnecting.style.display="none";
        wrapperLogin.style.display="block";
        $('#login_username').focus();
        $('#login_username').select();
    });
    
    socket.on('login', function (rooms) {
        renderHome(rooms, nickname, socket);
        wrapperLogin.style.display="none";
        wrapperHome.style.display="block";
    });
    
    socket.on('chatmessage', function (data) {
        var text            = data.text,
            username        = data.username,
            room            = data.room;
        addEntryToRoom(room,username,text);
    });
    socket.on('joining user',function(data){
        var username        = data.username,
            room            = data.room;
        addEntryToRoom(room,false,username+" joining this room");        
    });
    socket.on('disconnect', function (data) {
        console.log(data);
        wrapperLogin.style.display="none";
        wrapperHome.style.display="none";
        wrapperConnecting.style.display="block";
    });
});
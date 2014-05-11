var dParent         = document.getElementById('page_home'),
    dRoomlist       = document.createElement('div'),
    dContentView    = document.createElement('div'),
    dRoomWrapper    = document.createElement('div'),
    dUserListWrapper    = document.createElement('div'),
    dInputWrapper   = document.createElement('div'),
    
    currentRoom     = null,
    
    dRooms    = {},
    interval = null;
    
function addRoom(name){
    var dRoom = document.createElement('div');
    dRoom.id = 'roomwrapper_'+name;
    dRooms[dRoom.id] = dRoom;
    dRoom.className="room";
    dRoomWrapper.appendChild(dRoom);
    setTimeout(function(){
        addEntryToRoom(name,false,"Welcome to the room '"+name+"'");
    },300);
};

function showRoom(name){
    showNoRoom();
    var dRoom = dRooms['roomwrapper_'+name];
    console.log(dRoom);
    dRoom.style.display="block";
};

function showNoRoom(){
    for(var id in dRooms){
        var dRoom = dRooms[id];
        dRoom.style.display="none";
    }
};

function addEntryToRoom(room,username,text, bOwnMessage){
    var dEntryWrapper   = document.createElement('div'),
        dEntry          = document.createElement('p'),
        dEntryName      = document.createElement('span');
    
    if(bOwnMessage){
        dEntryName.className="me";
    }
    
    dEntryName.appendChild(document.createTextNode(username+": "));
    if(username){
        dEntry.appendChild(dEntryName);
    } else {
        dEntry.className="system";
    }
    dEntry.appendChild(document.createTextNode(text));
    dEntryWrapper.appendChild(dEntry);
    document.getElementById('roomwrapper_'+room).appendChild(dEntryWrapper);
}

function renderHome(rooms,nickname,socket){
    dParent         = document.getElementById('page_home');
    dRoomlist       = document.createElement('div');
    dContentView    = document.createElement('div');
    dRoomWrapper    = document.createElement('div');
    dUserListWrapper    = document.createElement('div');
    dInputWrapper   = document.createElement('div');
    currentRoom     = null;
    
    dRooms    = {};
    interval = null;
    
    var firstRoom = null;
    
    $(document).on('click',function(){
        try{
            $(dInputMessage).focus();
        }catch(e){};
    });
    
    interval = setInterval(function(){
        try{
            $(dInputMessage).focus();
        }catch(e){};        
    },200);
    
    
    dRoomlist.className="roomlist";
    
    //build roomlist
    dRoomlist.appendChild(document.createTextNode("Rooms"));
    dRoomlist.appendChild(document.createElement("hr"));
    for(var i=0,nLen=rooms.length; i<nLen; i++){
        var sRoomName = rooms[i],
            dRoom = document.createElement('div');
        dRoom.appendChild(document.createTextNode(sRoomName));
        if(!firstRoom){
            firstRoom = dRoom;
        }
        (function(r,name){
            r.id="room_"+name;
            r.roomName = name;
            addRoom(name);
            $(r).click(function(){
                var oldRoom = currentRoom;
                currentRoom = name;
                if($(r).hasClass('joined')){
                    $('#room_'+oldRoom).removeClass('active');
                } else {
                    $(r).addClass('joined');
                    socket.emit('join',name);
                    $('#room_'+oldRoom).removeClass('active');
                }
                $(r).addClass('active');
                showRoom(r.roomName);
            });
        })(dRoom,sRoomName);
        dRoomlist.appendChild(dRoom);
    }
    
    //build content view
    dContentView.className="contentwrapper";
    dRoomWrapper.className="roomWrapper";
    dInputWrapper.className="inputWrapper";
    var dInputMessage = document.createElement('input'),
        dSendMessage = document.createElement('input');
    
    dInputMessage.placeholder="type your message here";
    dInputMessage.className="message";
    
    dSendMessage.type="button";
    dSendMessage.value="send";
    dSendMessage.className="button";
    
    $(dSendMessage).click(function(){
        var message = {text:$(dInputMessage).val(), room:currentRoom};
        $(dInputMessage).val('');
        $(dInputMessage).focus();
        addEntryToRoom(message.room,nickname,message.text, true);
        socket.emit('message',message);
    });
    
    $(dInputMessage).keyup(function(e){
        if(e.keyCode == 13)
        {
            $(dSendMessage).click();
        }
    });
    
    
    dInputWrapper.appendChild(dInputMessage);
    dInputWrapper.appendChild(dSendMessage);
    
    
    dContentView.appendChild(dRoomWrapper);
    dContentView.appendChild(dInputWrapper);
    
    
    dParent.innerHTML="";
    dParent.appendChild(dRoomlist);
    dParent.appendChild(dContentView);
    
    if(!currentRoom && firstRoom){
        firstRoom.click();
    };
    
};
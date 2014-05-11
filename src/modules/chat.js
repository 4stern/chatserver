module.exports= {
    start:function(io){
        
        var aDefaultRoomsTop   = ['Lobby'],
            aDefaultRooms      = [
                'Freechat',
                'Coding',
                'Series',
                'Berlin',
                'Hamburg',
                'München'
            ];

        aDefaultRooms = aDefaultRoomsTop.concat(aDefaultRooms.sort());
        
        function getRoomNames(){
            var soiRooms = io.sockets.manager.rooms,
                aRoomList = [];
            for(var sRoomName in soiRooms){
                if(sRoomName !== ''){
                    var name = sRoomName.match(/^\//g)?sRoomName.slice(1):sRoomName;
                    aRoomList.push(name);
                }
            }
            for(var i=0,nLen=aDefaultRooms.length; i<nLen; i++){
                var dfRoomName = aDefaultRooms[i];
                if(aRoomList.indexOf(dfRoomName)===-1){
                    aRoomList.push(dfRoomName);
                }
            }
            return aRoomList;
        };
        io.sockets.on('connection', function(client) {
            console.log('connection',client.id);
            client.on('setNickname', function(nickname){
                client.set('nickname',nickname,function(){
                    client.emit('login', getRoomNames());
                    
                    
                    client.on('join', function(roomName){
                        console.log(client.id,"join room",roomName);
                        client.join(roomName);
                        client.broadcast.to(roomName).emit('joining user', {username: nickname, room: roomName});
                    });
                    client.on('leave', function(roomName){
                        console.log(client.id,"leave room",roomName);
                        client.leave(roomName);
                    });
                    
                    client.on('message', function(message){
                        console.log('message',message);
                        client.get('nickname',function(err,nickname){
                            //io.sockets.in(message.room).emit('chatmessage', nickname, message.text);
                            client.broadcast.to(message.room).emit('chatmessage', {username: nickname, text: message.text, room: message.room});
                        });
                    });
                    
                    client.on('userlist', function(roomName){
                    });
                    
                    
                });
            });
            

            /*client.on('message', function(message){
                var msg = { message: [client.id, message] };
                //buffer.push(msg);
                //if (buffer.length > 15) buffer.shift();
                io.sockets.emit('message', msg);
            });*/

            client.on('disconnect', function(){
                io.sockets.emit('announcement', client.id + ' disconnected');
            });
        });
    }
}
class ChatEngine{
    constructor(chatboxId, userEmail, userName){
        this.chatbox = $(`#${chatboxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        this.socket = io.connect('http://localhost:5000');

        // only create connection when user is logged in
        if(this.userEmail){
            this.connectHandler();
        }
    }


    // creates a connection with socket
    connectHandler(){

        let self = this;

        // fire new connection from client side
        this.socket.on('connect', function(){
            console.log('connection established using sockets');

            // fire new req for joining room from client side
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codial'
            });

            // get notification in chat room as new member joins the CR
            self.socket.on('user_joined', function(data) {
                console.log('a user joined ', data);
            });

        });

        // send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            $('#chat-message-input').val("");

            // if thier is some message
            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chatroom: 'codial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received ', data.message);

            let newMessage = $('<li>');
            
            let messageType = 'other-message';

            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_name
            }));

            newMessage.addClass(messageType);

            $('#chat-message-list-container').append(newMessage);

        });
    }

}
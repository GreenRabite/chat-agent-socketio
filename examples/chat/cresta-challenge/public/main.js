

setInterval(function(){
  let chatboxes = document.querySelectorAll(".client-chat");

  chatboxes.forEach(chatbox =>{
    chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
  });
}, 500);

// setInterval(function(){
//   let messages = document.querySelectorAll(".messages-client");
//
//   messages.forEach(message =>{
//
//   });
// }, 500);

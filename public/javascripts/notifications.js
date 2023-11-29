document.addEventListener('DOMContentLoaded', function () {
    getNotifications();
   setInterval(getNotifications, 30000);
});

function getNotifications() {
    let message = null;
    $.ajax({
        url: "/notifications",
        type: 'GET',
        success: function (response) {
            if(response.message == "No new notifications"){
                return;
            }
            else{
                message = (JSON.parse(response.notifications[0]));
                
                let messagecontent = message.Message;
                let notificationparentdiv = document.getElementById('notification_parentDiv');
                let messagediv = document.createElement('div');
                messagediv.classList.add('urbanMessageDiv');

                let messagedivheader = document.createElement('div');
                messagedivheader.classList.add('urbanMessageDivHeader');

                const label = document.createElement('label');
                label.classList.add('urbanWearMessagesLabel');
                label.textContent = 'Message:';
                messagedivheader.appendChild(label);

                const dateandtime = document.createElement('label');
                dateandtime.classList.add('urbanWearTimestamp');
                const date = new Date(message.Timestamp);
                const localDate = date.toLocaleDateString(); 
                const localTime = date.toLocaleTimeString(); 
                dateandtime.textContent = localDate + " - " + localTime;
                messagedivheader.appendChild(dateandtime);
                messagediv.appendChild(messagedivheader);

                const newMessageDiv = document.createElement('div');
                newMessageDiv.classList.add('urbanWearMessages');
                newMessageDiv.textContent = messagecontent;
                messagediv.appendChild(newMessageDiv);

                notificationparentdiv.appendChild(messagediv);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error:", textStatus, errorThrown);
        }
    })
}
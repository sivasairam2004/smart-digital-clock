let alarms = JSON.parse(localStorage.getItem("alarms")) || [];

function updateClock() {
    const timezone = document.getElementById("timezone").value;
    const options = { timeZone: timezone !== "local" ? timezone : undefined, hour12: false };
    const nowTimeZone = new Date().toLocaleString("en-US", options);
    const now = new Date(nowTimeZone);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = hours < 10 ? "0"+hours : hours;
    minutes = minutes < 10 ? "0"+minutes : minutes;
    seconds = seconds < 10 ? "0"+seconds : seconds;

    document.getElementById("time").innerText = `${hours}:${minutes}:${seconds} ${ampm}`;

    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    document.getElementById("date").innerText = `${days[now.getDay()]}, ${now.toDateString()}`;

    // Greeting Message
    const hour = now.getHours();
    let greetingText = "Hello";
    if(hour < 12) greetingText = "Good Morning";
    else if(hour < 18) greetingText = "Good Afternoon";
    else greetingText = "Good Evening";
    document.getElementById("greeting").innerText = greetingText;

    // Check all alarms
    alarms.forEach(alarm => {
        if(alarm.time === `${now.getHours() < 10 ? "0":""}${now.getHours()}:${minutes}`){
            const sound = new Audio(alarm.sound);
            sound.play();
            setTimeout(() => { sound.pause(); sound.currentTime=0; }, 45000);
        }
    });
}

setInterval(updateClock, 1000);

// Set Alarm
function setAlarm(){
    const time = document.getElementById("alarmTime").value;
    const label = document.getElementById("alarmLabel").value || "Alarm";
    const soundSelect = document.getElementById("alarmSoundSelect").value;
    if(!time) return;

    alarms.push({time,label,sound:soundSelect});
    localStorage.setItem("alarms", JSON.stringify(alarms));
    document.getElementById("alarmStatus").innerText = `⏰ Alarm set: ${label} at ${time}`;
    document.getElementById("alarmTime").value = "";
    document.getElementById("alarmLabel").value = "";

    renderAlarms();
}

// Render Alarm List
function renderAlarms(){
    const list = document.getElementById("alarmList");
    list.innerHTML = "";
    alarms.forEach((alarm,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `<span>${alarm.label} - ${alarm.time}</span>
                        <button class="delete-btn" onclick="deleteAlarm(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

// Delete Alarm
function deleteAlarm(index){
    alarms.splice(index,1);
    localStorage.setItem("alarms",JSON.stringify(alarms));
    renderAlarms();
    document.getElementById("alarmStatus").innerText = "❌ Alarm deleted";
}

// Stop Alarm
function stopAlarm(){
    alarms.forEach(alarm=>{
        const sound = new Audio(alarm.sound);
        sound.pause();
        sound.currentTime=0;
    });
    document.getElementById("alarmStatus").innerText = "🔕 Alarm stopped";
}

// Render existing alarms on page load
renderAlarms();

function toggleMode(){
    document.body.classList.toggle("dark");
}

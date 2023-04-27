import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContianer = document.querySelector('#chat_contianer');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '?';                                                   

    if (element.textContent === '????') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqeId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {

  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img 
                  src="${isAi ? bot : user}" 
                  alt="${isAi ? 'bot' : 'user'}" 
                />
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
        </div>
    </div>
    `
  )

}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContianer.innerHTML += chatStripe(false, data.get('prompt'));
  
  form.reset();
  
  const uniqueId = generateUniqeId();
  chatContianer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContianer.scrollTop = chatContianer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  
  loader(messageDiv);

  //fetch data from server --> bot's respone

  const respone = await fetch('https://hussain-ai-chatbot.onrender.com',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(respone.ok){
    const data = await respone.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  }else {
    const error = await respone.text();

    messageDiv.innerHTML = "Something went wrong ";

    alert(error);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13){
    handleSubmit(e);
  }
})

 
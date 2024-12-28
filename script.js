// Check if the user is logged in, if not, redirect to login page
if (!localStorage.getItem('loggedIn') || localStorage.getItem('loggedIn') === 'false') {
  window.location.href = 'login.html';
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let spins = currentUser.spins;
let points = currentUser.points;
let day = localStorage.getItem('day') || 1;
let rewardClaimed = localStorage.getItem('rewardClaimed') === 'true';

// Display the current user’s creator code
document.getElementById('creator-code').textContent = `Your Creator Code: ${currentUser.creatorCode}`;

// Update UI with spins and points
document.getElementById('spin-count').textContent = spins;
document.getElementById('points-count').textContent = points;

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'game.html';
  } else {
    alert('Invalid username or password');
  }
});

// Redirect to signup page
document.getElementById('signup-btn').addEventListener('click', function() {
  window.location.href = 'signup.html';
});

// Generate random creator code
function generateCreatorCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Signup functionality
document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.some(user => user.username === username)) {
    alert('Username already exists');
    return;
  }

  const newUser = { 
    username, 
    password, 
    points: 0, 
    spins: 10, 
    creatorCode: generateCreatorCode() // Assign a random creator code to the new user
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Account created successfully! You can now login.');
  window.location.href = 'login.html';
});

// Redirect to login page
document.getElementById('login-btn').addEventListener('click', function() {
  window.location.href = 'login.html';
});

// Spin the slots
function spin() {
  if (spins <= 0) {
    alert("No spins left. Please claim your daily reward.");
    return;
  }

  spins--;
  currentUser.spins = spins;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  const slot1 = document.getElementById('slot1');
  const slot2 = document.getElementById('slot2');
  const slot3 = document.getElementById('slot3');

  // Generate random numbers for the slots
  const result1 = Math.floor(Math.random() * 10);
  const result2 = Math.floor(Math.random() * 10);
  const result3 = Math.floor(Math.random() * 10);

  slot1.textContent = result1;
  slot2.textContent = result2;
  slot3.textContent = result3;

  // Check for matching slots
  if (result1 === result2 && result2 === result3) {
    points += 10;
    alert("You won! 10 points earned.");
  }

  currentUser.points = points;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  document.getElementById('spin-count').textContent = spins;
  document.getElementById('points-count').textContent = points;
}

// Claim daily reward and add spins
function claimDailyReward() {
  if (rewardClaimed) {
    alert("You have already claimed your reward for today.");
    return;
  }

  spins += 30; // Adding 30 spins for daily reward
  rewardClaimed = true;
  localStorage.setItem('rewardClaimed', true);
  localStorage.setItem('day', ++day); // Increment the day
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  alert(`You've claimed your daily reward! You now have ${spins} spins.`);
  document.getElementById('spin-count').textContent = spins;
}

// Auto spin feature (Optional)
function startAutoSpin() {
  if (spins <= 0) {
    alert("No spins left. Please claim your daily reward.");
    return;
  }

  let interval = setInterval(function() {
    if (spins <= 0) {
      clearInterval(interval);
      alert("No more spins left.");
    } else {
      spin();
    }
  }, 2000);
}

// Share creator code and earn spins
function shareCreatorCode(creatorCode) {
  // Simulate sharing the creator code with another player
  let users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u => u.creatorCode === creatorCode);

  if (user) {
    user.spins += 100; // Reward the user who shared their code
    localStorage.setItem('users', JSON.stringify(users));
    alert("You've earned 100 spins by using the creator code!");
  } else {
    alert("Invalid creator code.");
  }
}

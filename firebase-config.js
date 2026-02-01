// Firebase Configuration for Cross-Computer Real-Time Collaboration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Export for use in other files
window.firebaseDB = database;

// Enhanced cross-computer synchronization
window.scheduleSync = {
  // Track connection status across computers
  isOnline: false,
  connectedUsers: 0,
  
  // Initialize cross-computer sync
  init: function() {
    if (typeof firebase !== 'undefined') {
      // Monitor connection status
      database.ref('.info/connected').on('value', (snapshot) => {
        this.isOnline = snapshot.val();
        this.updateConnectionDisplay();
      });
      
      // Track connected users across computers
      database.ref('activeUsers').on('value', (snapshot) => {
        const users = snapshot.val() || {};
        this.connectedUsers = Object.keys(users).length;
        this.updateUserCount();
      });
    }
  },
  
  // Update connection display
  updateConnectionDisplay: function() {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
      const indicator = statusElement.querySelector('.status-indicator');
      if (indicator) {
        if (this.isOnline) {
          indicator.className = 'status-indicator online';
          indicator.innerHTML = `🌐 Connected - ${this.connectedUsers} computer${this.connectedUsers !== 1 ? 's' : ''} online`;
        } else {
          indicator.className = 'status-indicator offline';
          indicator.innerHTML = '🔴 Offline - Changes saved locally';
        }
      }
    }
  },
  
  // Update user count display
  updateUserCount: function() {
    this.updateConnectionDisplay();
  }
};

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.scheduleSync.init();
});
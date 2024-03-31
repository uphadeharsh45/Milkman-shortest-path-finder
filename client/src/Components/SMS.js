const SMS = async (Number,msg) => {
    const phoneNumber = Number; // Replace with the recipient's phone number
    const message = msg; // Replace with the message content
    
    try {
      const response = await fetch('http://localhost:5000/api/routes/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      });
  
      const data = await response.json();
      if (data.success) {
        console.log('SMS sent successfully');
        // Handle success, e.g., display a success message to the user
      } else {
        console.error('Failed to send SMS:', data.error);
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      // Handle network errors or other unexpected errors
    }
  };
  
  export {SMS};
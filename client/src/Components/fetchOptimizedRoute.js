// fetchOptimizedRoute.js

const fetchOptimizedRoute = async (vehicles, services) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ vehicles, services }),
      redirect: "follow"
    };
  
    try {
      const response = await fetch(`https://graphhopper.com/api/1/vrp?key=${process.env.REACT_APP_GRAPHHOPPER_API_KEY}`, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching optimized route:', error);
      throw error;
    }
  };
  
  export { fetchOptimizedRoute };
  
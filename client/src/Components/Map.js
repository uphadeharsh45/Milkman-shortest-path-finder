import React, { useEffect, useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete,DirectionsService, DirectionsRenderer,InfoWindow } from '@react-google-maps/api'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import DistanceMatrix from './DistanceMatrix';
import LoadingBar from 'react-top-loading-bar';
import { SMS } from './SMS';

const libraries = ['places','directions'];
const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })
  let newarr=[]
  const [places, setPlaces] = useState([]);
  const [map, setmap] = useState(/** @type google.maps.Map */(null))
  const [searchPosition, setSearchPosition] = useState(null);
  const [temp, settemp] = useState({ name: "", lat: "", lng: "", time: "",phoneNumber:"" })
  const autocompleteRef = useRef(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [optimizedLocations, setOptimizedLocations] = useState([]);
  const [testlocation,setTestlocation]=useState([]);
  const [deadline,setDeadline]=useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsPanel, setDirectionsPanel] = useState(null);
  const [selectedMarker,setSelectedMarker]=useState("");
  const [progress,setProgress]=useState(0)
  const [loading, setLoading] = useState(false); 

  // const [calculatebox,setcalculatebox]=useState(false);
  // let screenwidth=window.innerWidth<768;

  let fontSize = window.innerWidth < 590 ? '2vw' : '15px';
  let navigate=useNavigate();


  useEffect(() => {
    // Get the current position using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setMarkers(prevMarkers => [...prevMarkers, {name:"current loc", lat: latitude, lng: longitude }]);
          console.log(currentPosition);
        },
        error => {
          console.error('Error getting current position:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if(localStorage.getItem('token')){
        // console.log(localStorage.getItem('token'))
    }
    else{
      console.log("logging in .....")
        navigate("/login");
    }
    
  }, [])

  const handleLogout =()=>{
    localStorage.removeItem('token');
    navigate("/login");
  }



  const handleAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;

    // Listen for place changes
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.log('Place not found');
        return;
      }
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      // setSearchPosition(location);
      // console.log(location)
    });
  };

  const handleSearch = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.log('Place not found');
      return;
    }
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    setSearchPosition(location)
    console.log(location)
  };

  const onLoad = (map) => {
    setmap(map);
  };


  const mapClicked = (clickEvent) => {
    const newLatLng = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng()
    };
    setClickedLatLng(newLatLng);
    settemp(temp => ({ ...temp, lat: newLatLng.lat, lng: newLatLng.lng }));
    // console.log(clickedLatLng); 
  };

  useEffect(() => {
    // console.log(clickedLatLng);
    console.log(temp);
  }, [clickedLatLng]);

  const handleadd = () => {
    if (temp.phoneNumber.length !== 10) {
      alert('Please enter a 10-digit phone number');
      return;
    }
    console.log(temp); // Here you have access to the complete temp object with all values
    setPlaces(prevPlaces => {
      const newPlaces = [...prevPlaces, temp];
      // console.log("New places:", newPlaces);
      return newPlaces;
    });
    setMarkers(prevMarkers => [...prevMarkers,{name:temp.name, lat: temp.lat, lng: temp.lng } ]);
    settemp(prevTemp => ({ ...prevTemp, name: "" }));
    // console.log(places) // Add temp to the places array
  };
  useEffect(() => {
    console.log(places);
  }, [places]);

  const clearMarkers = () => {
    setMarkers([]); // Clear the markers array
  };

    const handleCalculateRoute = async () => {
      clearMarkers();
      setLoading(true);
      setProgress(30);
      try {
        const response = await fetch('http://localhost:5000/api/routes/addroute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')

          },
          body: JSON.stringify({
           
            locations: places // Pass the places array to be added to the route
          }),
        });
        const data = await response.json();
        console.log('Route added successfully:', data);
      } catch (error) {
        console.error('Error adding route:', error);
      }
      const newlocations = places.map(place => ({
        lat: place.lat,
        lng: place.lng
      }));

      if (currentPosition) {
        newlocations.unshift({
          lat: currentPosition.lat,
          lng: currentPosition.lng
        });
      }

   
    setTestlocation(newlocations);
    // setcalculatebox(true);
    document.getElementById('directionbox').style.visibility='visible';
    document.getElementById('customers').style.visibility='hidden';
     // Calculate time difference for deadlines
  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentTime = currentHours + currentMinutes / 60; // Convert current time to hours

  const deadlines = places.map((place, index) => {
    // Parse place time
    const placeTimeParts = place.time.split(":");
    const placeHours = parseInt(placeTimeParts[0]);
    const placeMinutes = parseInt(placeTimeParts[1]);
    const placeTimeInHours = placeHours + placeMinutes / 60;

    // Calculate time difference in hours
    return Math.abs(placeTimeInHours - currentTime); // Absolute difference in hours
  });

  deadlines.unshift(0);

  setDeadline(deadlines);
      
    };

    useEffect(() => {
       newarr=optimizedLocations.slice(0, Math.ceil(optimizedLocations.length / 2));
      console.log(newarr)
    }, [optimizedLocations]);

    useEffect(()=>{
      console.log(testlocation);
      console.log(deadline);
    },[testlocation,deadline])

    const fetchDirections = () => {
      if (optimizedLocations.length < 2) {
        return; // Not enough locations for directions
      }
    // eslint-disable-next-line no-undef
      const origin = new google.maps.LatLng(optimizedLocations[0].lat, optimizedLocations[0].lng);
       // eslint-disable-next-line no-undef
      const destination = new google.maps.LatLng(optimizedLocations[optimizedLocations.length - 1].lat, optimizedLocations[optimizedLocations.length - 1].lng);
      const waypoints = optimizedLocations.slice(1, -1).map(location => ({
            // eslint-disable-next-line no-undef
        location: new google.maps.LatLng(location.lat, location.lng),
        stopover: true
      }));
    // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          waypoints,
              // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
              // eslint-disable-next-line no-undef
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            setProgress(100);
            setLoading(false);
          } else {
            console.error('Directions request failed due to ' + status);
            setDirectionsResponse(null);
          }
        }
      );
    };

    useEffect(() => {
      if(!directionsResponse)
      fetchDirections();
    }, [optimizedLocations]);

    const matchPlacesWithOptimizedLocations = (optimizedLocations, places) => {
      return optimizedLocations.map(optLocation => {
        const matchedPlace = places.find(place => 
          place.lat === optLocation.lat && place.lng === optLocation.lng
        );
        return {
          ...optLocation,
          name: matchedPlace ? matchedPlace.name : "Unknown",
          phoneNumber:matchedPlace?'+91'+matchedPlace.phoneNumber:"Unknown" // Add customer name or use a default value
          // Add other properties from matchedPlace as needed
        };
      });
    };

    const sendSMS1 = async () => {
      const deliveryTimes = [];
      if (directionsResponse && directionsResponse.routes && directionsResponse.routes.length > 0) {
        const route = directionsResponse.routes[0]; // Assuming there's only one route
        route.legs.forEach((leg, index) => {
          const arrivalTime = new Date(Date.now() + leg.duration.value * 1000); // Convert duration to milliseconds
          deliveryTimes.push(arrivalTime);
        });
      }
    
      const matchedPlaces = matchPlacesWithOptimizedLocations(optimizedLocations, places);
    
      const oneThirdLength = Math.ceil(matchedPlaces.length / 3);
      const slicedArray = matchedPlaces.slice(0, oneThirdLength);
      const SMSarray = slicedArray.slice(1).map((place, index) => ({
        ...place,
        deliveryTime: deliveryTimes[index].toString(), // Assuming deliveryTimes and matchedPlaces are of the same length
      }));
    
      // Iterate over SMSarray and send SMS for each customer using for...of loop
      for (const customer of SMSarray) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
        SMS(customer.phoneNumber, `Your delivery time is ${customer.deliveryTime}`);
      }
    }
    

    if (!isLoaded) {
      return (
        <div className="container" style={{marginTop:'25%'}}>
          {/* <Spinner/> */}
          map not loaded 
        </div>
      )
    }

  const position = { lat: 19.1602, lng: 77.3102 };
  return (
    <>
     <DistanceMatrix locations={{ location: testlocation, deadline: deadline }} setOptimizedLocations={setOptimizedLocations} />
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">RouteMaster</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
              </ul>
              <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Autocomplete onLoad={handleAutocompleteLoad}>
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    </Autocomplete>
                  </li>
                  <li className="nav-item mx-2">
                    <button className="btn btn-danger" type="submit" onClick={handleSearch}>Search</button>
                  </li>
                  <li className="nav-item mx-2">
                    <button className="btn btn-danger" type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal">Add customer</button>
                  </li>
                  <li className="nav-item mx-2">
                    <button className="btn btn-danger" type="submit" onClick={handleCalculateRoute}>Calculate Route</button>
                  </li>

                  <li className="nav-item mx-2">
                    <button className='btn btn-danger mx-2' onClick={handleLogout}>Logout</button>
                  </li>
                  <li className="nav-item mx-2">
                    <button className='btn btn-danger mx-2' onClick={sendSMS1}>SMS</button>
                  </li>
               
                </ul>
              </form>
            </div>
          </div>
        </nav>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Place</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Name:</label>
                  <input type="text" className="form-control" id="recipient-name" style={{ backgroundColor: '#e4e4e4', border: '1px solid black' }} value={temp.name} onChange={(e) => settemp({ ...temp, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">Time:</label><br />
                  <input type="time" name="add_time" id="add_time" onChange={(e) => settemp({ ...temp, time: e.target.value })} value={temp.time}
                    style={{
                      padding: '6px 7px',
                      fontSize: '15px',
                      margin: '0px',
                      borderRadius: '7px',
                      backgroundColor: '#e4e4e4',
                      color: 'black',
                      cursor: 'pointer'
                    }} 
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="recipient-number" className="col-form-label">Phone Number:</label>
                  <input type="text" className="form-control" id="recipient-number" style={{ backgroundColor: '#e4e4e4', border: '1px solid black' }} value={temp.phoneNumber} onChange={(e) => settemp({ ...temp, phoneNumber: e.target.value })} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleadd} disabled={!temp.name || !temp.time || !clickedLatLng}>Add Customer</button>
            </div>
          </div>
        </div>
      </div>

      <LoadingBar
        color='#f11946'
        progress={progress}
        shadow={true}
      />
      {/* <Spinner/> */}
      <div className="spinner-container" style={{ display: loading ? 'flex' : 'none' }}>
        <Spinner />
      </div>

      <div style={{ height: '94vh' }}>
        <GoogleMap
          onClick={mapClicked}
          zoom={15}
          center={searchPosition || currentPosition}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          options={{
            fullscreenControl: true,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false
          }}
          onLoad={(map) => { setmap(map) }}
        >
          {/* <Marker position={currentPosition} /> */}
          {clickedLatLng && <Marker position={clickedLatLng} />}
          <button className="btn btn-danger"
            style={{
              position: 'absolute',
              top: '2vh',
              left: '1vw',
              zIndex: '9999'
            }}
            onClick={() => {
              map.panTo(currentPosition);
            }}
          >
            Return
          </button>
          <div className="container-fluid" id='customers'
            style={{
              position: 'absolute',
              top: '10vh',
              left: '1vw',
              width: '15vw',
              zIndex: '9999',
              backgroundColor: '#e4e4e4',
              padding: '10px',
              borderRadius: '1vh'
            }}>
            <ul
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                listStyle: 'none',
                padding: '0.2vh',
                fontWeight:'bold',
                fontSize:fontSize
              }}>
              <li className='nav-item'>Name</li>
              <li className='nav-item'>Time</li>
            </ul>
                <div className="container mx-2">
                  {places.length === 0 && 'No destinations to Display'}
                </div>
            {places.map((place,index) => (
              <>
              {/* <Marker key={index} position={place} /> */}
              <ul
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  padding: '0vh',
                  fontSize:fontSize
                }}>
                <li className='nav-item'>{place.name}</li>
                <li className='nav-item'>{place.time}</li>
              </ul>
              </>
            ))}
          </div>
          {directionsResponse && (
    <DirectionsRenderer
      options={{
        directions: directionsResponse,
        panel: directionsPanel // Display textual directions in a panel
      }}
    />
  )}
    {markers.map((marker, index) => (
           <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} onClick={()=>{setSelectedMarker(marker)}} />
        ))}
        {selectedMarker && (
          <InfoWindow position={{lat:selectedMarker.lat,lng:selectedMarker.lng}} onCloseClick={(e)=>{setSelectedMarker(null)}} zIndex={999} key={selectedMarker.name} >
            <div>{selectedMarker.name}</div>
          </InfoWindow>
        )}
         
        <div ref={setDirectionsPanel} id='directionbox' style={{
              position: 'absolute',
              top: '10vh',
              left: '1vw',
              width: '17vw',
              height:'35vw',
              zIndex: '9999',
              backgroundColor: '#e4e4e4',
              padding: '10px',
              borderRadius: '1vh',
              overflow:'scroll',
              visibility:'hidden'
            }}/>
        </GoogleMap>
        {/* {!screenwidth &&<div ref={setDirectionsPanel}/>} */}
      </div>
    </>
  )
}

export default Map

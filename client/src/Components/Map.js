import React, { useEffect, useRef, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const libraries = ['places'];
const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDxgAdwDaCyixQZ-GHZRxejom_NGRQ4s8M',
    libraries: libraries
  })

  const [places, setPlaces] = useState([]);
  const [map, setmap] = useState(/** @type google.maps.Map */(null))
  const [searchPosition, setSearchPosition] = useState(null);
  const [temp, settemp] = useState({ name: "", lat: "", lng: "", time: "" })
  const autocompleteRef = useRef(null);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  let fontSize = window.innerWidth < 590 ? '2vw' : '15px';
  let navigate=useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
        // getallnotes()
        console.log(localStorage.getItem('token'))
    }
    else{
      console.log("logging in .....")
        navigate("/login");
    }
    
  }, [])


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
    // Perform validation if needed
    console.log(temp); // Here you have access to the complete temp object with all values
    setPlaces(prevPlaces => {
      const newPlaces = [...prevPlaces, temp];
      // console.log("New places:", newPlaces);
      return newPlaces;
    });
    // console.log(places) // Add temp to the places array
  };
  useEffect(() => {
    // console.log(clickedLatLng);
    console.log(places);
  }, [places]);

    // Function to handle the "Calculate Route" button click event
    const handleCalculateRoute = async () => {
      try {
        // Make an HTTP POST request using the Fetch API
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
        // Handle success or redirect to another page if needed
      } catch (error) {
        console.error('Error adding route:', error);
        // Handle error
      }
    };

  if (!isLoaded) {
    return (<div>Map not Loaded</div>)
  }

  const position = { lat: 19.1602, lng: 77.3102 };
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Uphade Routes</Link>
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
                    <button className="btn btn-danger" type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal">Add Place</button>
                  </li>
                  <li className="nav-item mx-2">
                    <button className="btn btn-danger" type="submit" onClick={handleCalculateRoute}>Calculate Route</button>
                  </li>

                  <li className="nav-item mx-2">
                    <Link className='btn btn-danger mx-2' to='/login' role='button'>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className='btn btn-danger mx-2' to='/signup' role='button'>Signup</Link>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </nav>
      </div>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                    }} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" onClick={handleadd}>Add Place</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '94vh' }}>
        <GoogleMap
          onClick={mapClicked}
          zoom={15}
          center={searchPosition || position}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          options={{
            fullscreenControl: true,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false
          }}
          onLoad={(map) => { setmap(map) }}
        >
          <Marker position={position} />
          {clickedLatLng && <Marker position={clickedLatLng} />}
          <button className="btn btn-danger"
            style={{
              position: 'absolute',
              top: '2vh',
              left: '1vw',
              zIndex: '9999'
            }}
            onClick={() => {
              map.panTo(position);
            }}
          >
            Return
          </button>
          <div className="container-fluid"
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
            <div className="container mx-2">
              {places.length === 0 && 'No destinations to Display'}
            </div>
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
            {places.map((place,index) => (
              <>
              <Marker key={index} position={place} />
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
        </GoogleMap>
      </div>
    </>
  )
}

export default Map

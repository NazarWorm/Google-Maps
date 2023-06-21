import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import {useLoadScript, GoogleMap, StandaloneSearchBox, MarkerF, Marker} from '@react-google-maps/api';
import {FaMapMarkedAlt} from 'react-icons/fa'
import {BsFillPlusCircleFill} from 'react-icons/bs';
import MarkerTab from '../components/MarkerTab';
import markersData from '../json/markers.json';
import {ToastContainer, toast} from 'react-toastify';
import env from 'react-dotenv';

//

interface IMain{
}

//interface for the user's data
interface IUserData{
   id: number;
   name: string;
   username: string;
   email: string;
   address: {
       street: string;
       suite: string;
       city: string;
       zipcode: string;
       geo: {
           lat: string;
           lng: string;
       }
   };
   phone: string;
   website: string;
   company: {
       name: string;
       catchPhrase: string;
       bs: string;
   }
}

//interface for the saved marker's data
interface IMarker{
   name: string,
    position: {
        lat: number,
        lng: number,
    },
    photo: string,
    description: string,
    userID: number,
}

function Main ( props: IMain ){

   //Map Reference
   const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
   //Location of the user
   const [pcLoc, setPCLoc] = useState<{lat: number, lng: number}>({lat: 10, lng: 10});
   //Center of the map
   const [center, setCenter] = useState<{lat: number, lng: number}>({lat: 10, lng: 10});
   //Libraries to load into the searchbar
   const libraries: ("drawing" | "geometry" | "localContext" | "places" | "visualization")[] = ['places'];
   //Searchbar Reference
   const [searchBarRef, setSearchBarRef] = useState<google.maps.places.SearchBox | null>(null);
   //Position of the marker
   const [markerPos, setMarkerPos] = useState<{lat: number, lng: number}>({lat: 10, lng: 10});
   //Lat Input
   const inputLatRef = useRef<HTMLInputElement>(null);
   //Lng Input
   const inputLngRef = useRef<HTMLInputElement>(null);
   //Marker Name
   const inputNameRef = useRef<HTMLInputElement>(null);
   //Marker Description
   const inputDescRef = useRef<HTMLInputElement>(null);
   //Marker Photo
   const inputPhotoRef = useRef<HTMLInputElement>(null);
   //All markers
   const [markers, setMarkers] = React.useState<IMarker[] | null>(null);
   //Show/Hide new marker creation window
   const [addMarkerShow, setAddMarkerShow] = useState<boolean>(false);
   //Reference to the <div> containing all marker tabs
   const markersDivRef = useRef<Component>(null);
   //Data about the currently logged in user
   const [userData, setUserData] = useState<IUserData | null>(null);


   //Loading the map
   const { isLoaded } = useLoadScript({
      googleMapsApiKey: "AIzaSyCh_rL3Nk-p8NIUQoRwKQkZBVHiaQvL43o", 
      libraries: libraries  
      });

   //function to stop app for a certain time
   const delay = (ms: number) => new Promise(
      resolve => setTimeout(resolve,ms)
   );

   //Loading user's markers
   React.useEffect(() => {
      const localMarkers = localStorage.getItem("LOCAL_MARKERS");
      if(localMarkers != null){ //if markers data already exists in local storage, load it from there
         console.log("Loaded Markers from local storage!");
         setMarkers(JSON.parse(localMarkers));
      }else{ //if markers data does not exist in local storage, load it from the template .json file and save it to the local storage
         console.log("Loaded Markers from json template!");
         localStorage.setItem("LOCAL_MARKERS", JSON.stringify(markersData));
         setMarkers(JSON.parse(localStorage.getItem("LOCAL_MARKERS")!));
      }
   }, []);

   //Delete a marker
   const deleteMarker = (thisMarker: IMarker) => {
      //create a new array of markers, and push into it all of the markers that don't have the same name and position as the deleted marker
      const newMarkers = markers?.filter((item) => (item.name !== thisMarker.name || item.position !== thisMarker.position));
      console.log(newMarkers);
      if(newMarkers !== null && newMarkers !== undefined){
         localStorage.setItem("LOCAL_MARKERS", JSON.stringify(newMarkers));
         setMarkers(JSON.parse(localStorage.getItem("LOCAL_MARKERS")!));
      }
      console.log(markers);
   }

   //Force Update the div containing all of the marker tabs
   useEffect(() => {
      markersDivRef.current?.forceUpdate();
   }, [markers]);

   //Adding new marker function
   const addMarkerHandler = () => {
      //creating the new marker
      const newMarker: IMarker = {
         name: inputNameRef.current?.value!,
         description: inputDescRef.current?.value!,
         photo: inputPhotoRef.current?.value!,
         position: {lat: parseFloat(inputLatRef.current?.value!), lng: parseFloat(inputLngRef.current?.value!)},
         userID: userData?.id!
      }
      console.log(newMarker);
      //creating a new markers array, identical to the current onw
      const newMarkersList = markers;
      //adding the new marker
      newMarkersList?.push(newMarker);
      //replacing the old markers array with the new one, both in the local storage and the variable
      localStorage.setItem("LOCAL_MARKERS", JSON.stringify(newMarkersList));
      setMarkers(newMarkersList);
      //show toast to confirm the addition of the new marker
      toast.success(`Successfully Added "${newMarker.name}"!`, {
         position: toast.POSITION.BOTTOM_CENTER,
         hideProgressBar: true,
         autoClose: 2000
      });
      //hide the marker addition menu
      setAddMarkerShow(false);
   }

   //Load data about the currently logged in user
   useEffect(() => {
      setUserData(JSON.parse(localStorage.getItem("USER_AUTH_DATA")!));
   }, []);

   //every time the center variable/state changes:
   //set the position of the marker to the position of the center
   //load the latitude and longtitude of the new center, into the input fields of the "new marker" menu
   useEffect(() => {
      const lat = mapRef?.getCenter()?.lat()!;
      const lng = mapRef?.getCenter()?.lng()!;
      setMarkerPos(center);
      setLatLngInputs(lat, lng);
   }, [center]);
   
   //get the current coordinates of the user's pc, save them to pcLoc, and set the center to these coordinates
   useEffect(() => {
      if ('geolocation' in navigator){
         navigator.geolocation.getCurrentPosition((position) => {
            setPCLoc({lat: position.coords.latitude, lng: position.coords.longitude});
            setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
         });
      }
   }, []);
   
   //create tabs for all the user's saved markers
   const loadMarkers = () => {
      return <>{
         //iterate over every saved marker
         markers?.map((marker, index: number) => {
            //if the markers 'userId' equals to the id of the current logged in user, create a tab for this marker
            if(marker.userID === userData?.id){
               return <div onClick={() => setCenter(marker.position)} className='group flex items-center place-content-center odd:bg-slate-100 even:bg-slate-200 '>
                        <div className='absolute z-10 flex flex-row items-center place-content-center border border-accent border-opacity-50 bg-secondary rounded-md p-2 translate-x-[125%] shadow-md scale-0 transition-all group-hover:scale-100'>
                           <div className='flex flex-col items-center place-content-center'>
                              <span className='font-light'>{"lat: "+marker.position.lat}</span>
                              <span className='font-light'>{"lng: "+marker.position.lng}</span>
                              <img src={marker.photo} alt='Markerphoto' className='rounded-md shadow-sm mt-2 w-32'/>
                           </div>
                        </div>
                        <MarkerTab deleteHandler={() => deleteMarker(marker)} key={index} marker={marker}/>
                     </div>
            }
         })
      }</>
   }

   //set a reference to the searchbar when it loads
   const searchOnLoadHandler = (searchbox: google.maps.places.SearchBox) => {
      setSearchBarRef(searchbox);
   };

   //focus the map on the selected location, whenever the user searches for someplace
   const searchOnPlaceChangedHandler = () => {
      const places = searchBarRef?.getPlaces();
      const Nlat = places![0].geometry?.location?.lat()!;
      const Nlng = places![0].geometry?.location?.lng()!;
      setCenter({lat: Nlat? Nlat: 17, lng: Nlng? Nlng: 18});
   };

   //load the coordinates of the marker into the lat and lng input fields of the "new marker" menu
   const markerOnClickHandler = (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat()!;
      const lng = e.latLng?.lng()!;
      setLatLngInputs(lat, lng);
   }

   //set a reference to the map element, when it loads
   const onMapLoadHandler = (map: google.maps.Map) => {
      setMapRef(map);
   }

   //load the lat and lng parameters into the lat and lng input fields of the "new marker" menu
   const setLatLngInputs = (lat: number, lng: number) => {
      if(inputLatRef.current?.value !== undefined && inputLngRef.current?.value !== undefined){
         inputLatRef.current.value = lat+"";
         inputLngRef.current.value = lng+"";
      }
   }

   //change the marker's position the where the user clicks on the map
   const onMapClickHandler = (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat()!;
      const lng = e.latLng?.lng()!;
      setMarkerPos({lat: lat, lng: lng});
      setLatLngInputs(lat, lng);
   }

   //when user stops dragging the map, set the 'center' variable to the new center of the map
   const onMapDragEndHandler = () => {
      const lat = mapRef?.getCenter()?.lat()!;
      const lng = mapRef?.getCenter()?.lng()!;
      setCenter({lat: lat, lng: lng});
   }

   return (
      <>
         <div className='backgroundScreen overflow-clip'>
            <ToastContainer/>
            <Navbar/>
            <div className='w-screen h-full flex z-0'>
               <div className='bg-background border-r-2 overflow-y-scroll no-scrollbar border-secondary shadow-lg flex flex-col h-[93%] w-[25%]'>
                  <div className='w-full h-full'>
                     {
                        markers ? loadMarkers():<></>
                     }
                  </div>
                  <div className='flex flex-row items-center place-content-end w-full h-fit'>
                     {
                        addMarkerShow ? <>
                        <div className='animate-slideUp w-full h-fit p-2 flex flex-col place-content-center items-center bg-secondary rounded-t-lg border border-accent border-opacity-20'>
                           <input ref={inputNameRef} type='text' placeholder='name' className='rounded-sm shadow-md placeholder:uppercase font-extralight p-1'/>
                           <input ref={inputDescRef} type='text' placeholder='description' className='rounded-sm my-2 shadow-md placeholder:uppercase font-extralight p-1'/>
                           <input ref={inputPhotoRef} type='text' placeholder='photo url' className='rounded-sm my-2 shadow-md placeholder:uppercase font-extralight p-1'/>
                           <div className='flex flex-row mb-2'>
                              <input ref={inputLatRef} type='number' placeholder='latitude' className='rounded-sm w-full shadow-md placeholder:uppercase font-extralight p-1 mr-1'/>
                              <input ref={inputLngRef} type='number' placeholder='longitude' className='rounded-sm w-full shadow-md placeholder:uppercase font-extralight p-1 ml-1'/>
                           </div>
                           <div className='flex flex-row'>
                           <input onClick={() => addMarkerHandler()} type='button' value={"Save"} className='uppercase font-extralight border-2 w-fit h-fit border-accent rounded-md px-2 py-1 text-accent transition-all duration-500 hover:bg-accent hover:text-white hover:scale-110 mr-2'/>
                           <input onClick={() => setAddMarkerShow(false)} type='button' value={"Cancel"} className='uppercase font-extralight border-2 w-fit h-fit border-accent rounded-md px-2 py-1 text-accent transition-all duration-500 hover:bg-accent hover:text-white hover:scale-110'/>
                           </div>
                        </div>
                        </>:<BsFillPlusCircleFill className='scale-[1.2] m-2 transition-all duration-500 hover:fill-slate-600 hover:scale-[1.4]' onClick={() => setAddMarkerShow(true)}/>
                     }
                  </div>
               </div>
               <div className='flex flex-col px-6 pb-6 w-screen h-[93%]'>
                  {
                     !isLoaded ?
                     <>
                        <span>Loading...</span>
                     </>
                     :
                     <>
                        <div className='flex flex-row items-center place-content-center'>
                           <StandaloneSearchBox 
                           onLoad={searchOnLoadHandler} 
                           onPlacesChanged={searchOnPlaceChangedHandler}>

                              <input type='text' placeholder='Search Place' className='my-3 px-4 py-2 rounded-lg shadow-md border outline-none transition-all duration-500 focus:scale-[1.15]'/>

                           </StandaloneSearchBox>
                           <FaMapMarkedAlt className='scale-[1.5] mx-6 transition-all hover:scale-[1.75] hover:fill-slate-500' onClick={() => {setCenter(pcLoc); setMarkerPos(pcLoc)}}/>
                        </div>
                        <div className='flex w-full h-full rounded-xl overflow-clip'>
                           <GoogleMap zoom={15} onDragEnd={onMapDragEndHandler} onLoad={onMapLoadHandler} center={center} mapContainerClassName='googleMap' onClick={onMapClickHandler}>
                              <MarkerF onClick={markerOnClickHandler} position={markerPos}/>
                           </GoogleMap>
                        </div>
                     </>
                  }
               </div>
            </div>
         </div>
      </>
   );
}

export default Main
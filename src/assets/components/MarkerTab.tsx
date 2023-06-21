import React from 'react';
import markersData from '../json/markers.json';
import {BsTrash} from 'react-icons/bs';
import {AiFillWarning} from 'react-icons/ai'
import { Id, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface IMarkerTab{
   onClickFunc?: () => {},
   marker: IMarker,
   deleteHandler: () => {} | void
}

// `"${props.marker.name}" is about to be deleted. Click on this notification to cancel action.`

function MarkerTab ( props: IMarkerTab ){

   //Toast Reference
   const toastID = React.useRef<Id | null>(null);

   //Delete Marker (Function that is called when the user confirms the deletion of the marker)
   const deleteMarkerBTN = () => {
      //dismiss the previous toast (the one that asks you to confirm deletion of the marker)
      toast.dismiss(toastID.current!);
      //show toast that confirms the deletion of the marker
      toast.success(`Marker "${props.marker.name}" Has Been Deleted!`, {
         position: toast.POSITION.BOTTOM_CENTER,
         autoClose: 2000,
         hideProgressBar: true,
         closeOnClick: false,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
         bodyStyle: {fontSize: "12px"}
      });
      //delete marker from the localstorage
      props.deleteHandler();
   }

   //Show a warning toast before deleting the marker
   const showWarningToast = () => {
      //dismiss the previous toast
      toast.dismiss(toastID.current!);
      //show the warning toast
      toastID.current = toast.warn(
         <>
         <div className='flex flex-row items-center place-content-center'>
            <AiFillWarning/>
            <span className='uppercase font-bold'>
               note
            </span>
            <AiFillWarning/>
         </div>
         <span>This action will delete all of the markers that have the same name and position as the marker you're about to delete!</span>
         <br/>
         <input type='button' value={"Continue?"} className='bg-slate-200 px-2 py-1 rounded-md transition-all hover:bg-slate-300' onClick={deleteMarkerBTN}/>
         </>
      , {position: toast.POSITION.BOTTOM_CENTER, style: {fontSize: '12px'}, autoClose:2000});
   }

   //Function to show the toast that confirms the deletion of the marker
   const deleteMarkerHandler = () => {
      toastID.current = toast(
         <>
            <span>{`Are you sure you want to delete: "${props.marker.name}" ?`}</span>
            <br/>
            <input type='button' value={"Delete"} className='bg-slate-200 px-2 py-1 rounded-md transition-all hover:bg-slate-300' onClick={showWarningToast}/>
         </>,
         {
         position: toast.POSITION.BOTTOM_CENTER,
         autoClose: 30000,
         hideProgressBar: false,
         closeOnClick: false,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         theme: "light",
         bodyStyle: {fontSize: "12px"}
      });
   }

   return (
      <>
         <div className='h-full w-full  flex flex-row items-center p-2 transition-all hover:bg-slate-300' onClick={props.onClickFunc}>
            <div className='flex flex-col items-start w-full'>
               <span className='uppercase'>{props.marker.name}</span>
               <span className='text-sm text-start opacity-50 font-light'>{props.marker.description}</span>
            </div>
            <div className='flex h-full w-full items-center place-content-end'>
               <BsTrash className=' rounded-full w-fit h-fit p-1 transition-all hover:bg-slate-500' onClick={deleteMarkerHandler}/>
            </div>
         </div>
      </>
   );
}

export default MarkerTab
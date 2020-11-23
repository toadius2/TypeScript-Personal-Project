import axios from "axios";

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDyJMHAzSc1aVpIICsg_AuEWODj6uWM67g";

declare var google: any;

type GoogleGeocodingResponse = {  //My custom type
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "Okay" | "No Results!";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  //send to Google API via 3rd party tool AXios

  axios.get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI( //can pass in a compatible URL string by using this encodeURI
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then(response => {
      if (response.data.status !== "Okay") {
        throw new Error("Could not fetch specified location!");
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16
      }); 

      new google.maps.Marker({position: coordinates, map: map});
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
